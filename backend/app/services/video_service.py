import os
import tempfile
from typing import List, Tuple, Optional

from moviepy.editor import (
    ImageClip,
    VideoFileClip,
    AudioFileClip,
    TextClip,
    CompositeVideoClip,
    concatenate_videoclips,
    ColorClip,
)


class VideoService:
    def __init__(self, default_fps: int = 24, default_size: Tuple[int, int] = (1920, 1080)):
        self.default_fps = default_fps
        self.default_size = default_size

    @staticmethod
    def _safe_tempfile(suffix: str = "") -> str:
        fd, path = tempfile.mkstemp(suffix=suffix)
        os.close(fd)
        return path

    def create_scene_clip(
        self,
        image_path: str,
        duration: float,
        text_overlay: Optional[str] = None,
        transition: str = "fade",
    ) -> CompositeVideoClip:
        """
        Create a clip from an image with optional text overlay and simple transition.
        Returns a MoviePy clip (CompositeVideoClip or ImageClip).
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"image_path not found: {image_path}")

        clip = ImageClip(image_path).set_duration(duration)
        try:
            clip = clip.resize(newsize=self.default_size)
        except Exception:
            # fallback: keep original size if resize fails
            pass

        if transition == "fade":
            try:
                clip = clip.fadein(0.5).fadeout(0.5)
            except Exception:
                # some clip types might not support fade; ignore
                pass

        if text_overlay:
            # TextClip may require ImageMagick depending on your setup
            try:
                txt = TextClip(
                    text_overlay,
                    fontsize=40,
                    color="white",
                    font="DejaVu-Sans",
                    method="caption",
                    size=(int(self.default_size[0] * 0.85), None),
                    stroke_color="black",
                    stroke_width=1,
                ).set_position(("center", "bottom")).set_duration(duration)
                clip = CompositeVideoClip([clip, txt])
            except Exception:
                # If TextClip fails, continue without overlay
                pass

        return clip

    def create_text_scene(self, text: str, duration: float, background_color: Tuple[int, int, int] = (41, 128, 185)):
        """
        Create a full-screen text-only scene.
        """
        bg = ColorClip(size=self.default_size, color=background_color).set_duration(duration)

        try:
            txt = TextClip(
                text,
                fontsize=48,
                color="white",
                font="DejaVu-Sans",
                method="caption",
                size=(int(self.default_size[0] * 0.85), None),
            ).set_position("center").set_duration(duration)
            clip = CompositeVideoClip([bg, txt])
            try:
                clip = clip.fadein(0.5).fadeout(0.5)
            except Exception:
                pass
            return clip
        except Exception:
            # Fallback: simple background clip with no text if TextClip fails
            return bg

    def create_blank_scene(self, duration: float, background_color: Tuple[int, int, int] = (0, 0, 0)):
        return ColorClip(size=self.default_size, color=background_color).set_duration(duration)

    def compose_video(self, scene_clips: List, audio_path: Optional[str] = None, output_path: Optional[str] = None, logger=None) -> str:
        """
        Compose provided scene clips into a single MP4 file and optionally attach audio.
        Returns output_path.
        """
        if not scene_clips:
            raise ValueError("No scene_clips provided")

        if not output_path:
            output_path = self._safe_tempfile(suffix=".mp4")

        # Concatenate
        final = concatenate_videoclips(scene_clips, method="compose")

        # Attach audio if available
        if audio_path and os.path.exists(audio_path):
            audio = AudioFileClip(audio_path)
            try:
                if audio.duration > final.duration:
                    audio = audio.subclip(0, final.duration)
                final = final.set_audio(audio)
            finally:
                # don't close audio just yet; moviepy will handle it after writing
                pass

        # Write to file
        final.write_videofile(
            output_path,
            fps=self.default_fps,
            codec="libx264",
            audio_codec="aac",
            temp_audiofile=self._safe_tempfile(suffix=".m4a"),
            remove_temp=True,
            logger=logger,
        )

        # Clean up clips to release memory
        try:
            final.close()
        except Exception:
            pass
        for c in scene_clips:
            try:
                c.close()
            except Exception:
                pass

        return output_path

    def trim_video(self, input_path: str, output_path: Optional[str], start_time: float, end_time: float, logger=None) -> str:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"input_path not found: {input_path}")

        if not output_path:
            output_path = self._safe_tempfile(suffix=".mp4")

        clip = VideoFileClip(input_path).subclip(start_time, end_time)
        clip.write_videofile(
            output_path,
            fps=self.default_fps,
            codec="libx264",
            audio_codec="aac",
            temp_audiofile=self._safe_tempfile(suffix=".m4a"),
            remove_temp=True,
            logger=logger,
        )
        clip.close()
        return output_path

    def resize_video(self, input_path: str, output_path: Optional[str], size: Tuple[int, int] = (1920, 1080), logger=None) -> str:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"input_path not found: {input_path}")

        if not output_path:
            output_path = self._safe_tempfile(suffix=".mp4")

        clip = VideoFileClip(input_path).resize(newsize=size)
        clip.write_videofile(
            output_path,
            fps=self.default_fps,
            codec="libx264",
            audio_codec="aac",
            temp_audiofile=self._safe_tempfile(suffix=".m4a"),
            remove_temp=True,
            logger=logger,
        )
        clip.close()
        return output_path

    def extract_audio(self, input_path: str, output_path: Optional[str], logger=None) -> str:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"input_path not found: {input_path}")

        if not output_path:
            output_path = self._safe_tempfile(suffix=".mp3")

        clip = VideoFileClip(input_path)
        try:
            audio = clip.audio
            if audio is None:
                raise RuntimeError("No audio track found")
            audio.write_audiofile(output_path, logger=logger)
            audio.close()
        finally:
            clip.close()

        return output_path

    def merge_videos(self, video_paths: List[str], output_path: Optional[str], logger=None) -> str:
        if not video_paths:
            raise ValueError("video_paths must contain at least one file")

        for p in video_paths:
            if not os.path.exists(p):
                raise FileNotFoundError(f"video file does not exist: {p}")

        if not output_path:
            output_path = self._safe_tempfile(suffix=".mp4")

        clips = [VideoFileClip(p) for p in video_paths]
        try:
            final = concatenate_videoclips(clips, method="compose")
            final.write_videofile(
                output_path,
                fps=self.default_fps,
                codec="libx264",
                audio_codec="aac",
                temp_audiofile=self._safe_tempfile(suffix=".m4a"),
                remove_temp=True,
                logger=logger,
            )
            final.close()
        finally:
            for c in clips:
                try:
                    c.close()
                except Exception:
                    pass

        return output_path


    def add_watermark(self, input_path: str, output_path: Optional[str], watermark_path: str, position: Tuple[str, str] = ("right", "bottom"), opacity: float = 0.5, logger=None) -> str:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"input_path not found: {input_path}")
        if not os.path.exists(watermark_path):
            raise FileNotFoundError(f"watermark_path not found: {watermark_path}")

        if not output_path:
            output_path = self._safe_tempfile(suffix=".mp4")

        video = VideoFileClip(input_path)
        watermark = (
            ImageClip(watermark_path)
            .set_duration(video.duration)
            .resize(height=50)
            .set_pos(position)
            .set_opacity(opacity)
        )

        final = CompositeVideoClip([video, watermark])
        final.write_videofile(
            output_path,
            fps=self.default_fps,
            codec="libx264",
            audio_codec="aac",
            temp_audiofile=self._safe_tempfile(suffix=".m4a"),
            remove_temp=True,
            logger=logger,
        )

        try:
            final.close()
        except Exception:
            pass
        video.close()
        watermark.close()
        return output_path

    def extract_frames(self, input_path: str, output_dir: str, fps: int = 1) -> List[str]:
        if not os.path.exists(input_path):
            raise FileNotFoundError(f"input_path not found: {input_path}")

        os.makedirs(output_dir, exist_ok=True)
        clip = VideoFileClip(input_path)

        frame_paths: List[str] = []
        try:
            # iter_frames yields numpy arrays; saving via ImageClip.save_frame
            for i, frame in enumerate(clip.iter_frames(fps=fps)):
                frame_path = os.path.join(output_dir, f"frame_{i:05d}.png")
                ImageClip(frame).save_frame(frame_path)
                frame_paths.append(frame_path)
        finally:
            clip.close()

        return frame_paths
