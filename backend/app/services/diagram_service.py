import os
import tempfile
import json
from graphviz import Digraph, Graph
from app.services.llm_service import LLMService


class DiagramService:
    def __init__(self):
        self.llm = LLMService()

    # ============================================================
    # 1. FLOWCHART
    # ============================================================
    def create_flowchart(self, nodes, edges, output_path=None):
        if not output_path:
            output_path = tempfile.mktemp()

        dot = Digraph()
        dot.attr(rankdir="TB", size="10,10")
        dot.attr("node", shape="box", style="rounded,filled", fillcolor="lightblue")

        for node in nodes:
            dot.node(
                node.get("id", "node"),
                node.get("label", "Node"),
                shape=node.get("shape", "box"),
                fillcolor=node.get("color", "lightblue")
            )

        for e in edges:
            dot.edge(e.get("from"), e.get("to"), e.get("label", ""))

        dot.render(output_path, format="png", cleanup=True)
        return output_path + ".png"

    def create_diagram_from_text(self, description, output_path=None):
        prompt = f"""
Convert this text into a diagram JSON:
\"{description}\"

Return ONLY JSON like:
{{
  "nodes": [
    {{"id": "1", "label": "Start"}}
  ],
  "edges": [
    {{"from": "1", "to": "2", "label": ""}}
  ]
}}
"""

        try:
            resp = self.llm.client.chat.completions.create(
                model=self.llm.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1
            )

            content = resp.choices[0].message.content.strip()

            # Remove code fences
            if content.startswith("```"):
                content = content.replace("```json", "").replace("```", "").strip()

            data = json.loads(content)

            return self.create_flowchart(
                data.get("nodes", []),
                data.get("edges", []),
                output_path
            )

        except Exception:
            # fallback simple flowchart
            return self.create_flowchart(
                [{"id": "1", "label": description}],
                [],
                output_path
            )   # ← FIXED MISSING PARENTHESIS

    def create_mindmap(self, central_topic, branches, output_path=None):
        if not output_path:
            output_path = tempfile.mktemp()

        dot = Graph()
        dot.attr(layout="neato", overlap="false")

        dot.node("center", central_topic, shape="ellipse", fillcolor="gold", style="filled")

        colors = ["lightblue", "lightgreen", "lightyellow", "lightpink"]

        for i, b in enumerate(branches):
            node = f"b{i}"
            dot.node(node, b, fillcolor=colors[i % len(colors)], style="filled")
            dot.edge("center", node)

        dot.render(output_path, format="png", cleanup=True)
        return output_path + ".png"

    def create_mindmap_from_text(self, description, output_path=None):
        prompt = f"""
Convert this text into a mindmap JSON:
\"{description}\"

Return ONLY JSON:
{{
  "central_topic": "Main Topic",
  "branches": ["Branch 1", "Branch 2"]
}}
"""

        try:
            resp = self.llm.client.chat.completions.create(
                model=self.llm.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1
            )

            content = resp.choices[0].message.content.strip()

            # Clean code fences
            if content.startswith("```"):
                content = content.replace("```json", "").replace("```", "").strip()

            data = json.loads(content)

            return self.create_mindmap(
                data.get("central_topic", "Mindmap"),
                data.get("branches", []),
                output_path
            )

        except Exception:
            return self.create_mindmap(
                description,
                [],
                output_path
            )

    def create_organization_chart(self, members, output_path=None):
        if not output_path:
            output_path = tempfile.mktemp()

        dot = Digraph()
        dot.attr(rankdir="TB", size="10,10")
        dot.attr("node", shape="box", style="filled", fillcolor="lightgrey")

        for member in members:
            dot.node(
                member.get("id", "member"),
                member.get("name", "Member"),
                shape=member.get("shape", "box"),
                fillcolor=member.get("color", "lightgrey")
            )

        for m in members:
            if m.get("reports_to"):
                dot.edge(m["reports_to"], m["id"])

        dot.render(output_path, format="png", cleanup=True)
        return output_path + ".png"

    def create_organization_chart_from_text(self, description, output_path=None):
        prompt = f"""
Convert this text into an organization chart JSON:
\"{description}\"

Return ONLY JSON:
{{
  "members": [
    {{"id": "1", "name": "Alice", "reports_to": null}},
    {{"id": "2", "name": "Bob", "reports_to": "1"}}
  ]
}}
"""

        try:
            resp = self.llm.client.chat.completions.create(
                model=self.llm.model,
                messages=[{"role": "user", "content": prompt}],
                temperature=0.1
            )
            content = resp.choices[0].message.content.strip()

            if content.startswith("```"):
                content = content.replace("```json", "").replace("```", "").strip()

            data = json.loads(content)

            return self.create_organization_chart(
                data.get("members", []),
                output_path
            )
        except Exception:
            return self.create_organization_chart(
                [{"id": "1", "name": description, "reports_to": None}],
                output_path
            )
