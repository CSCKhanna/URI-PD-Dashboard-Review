import sys
import zipfile
import xml.etree.ElementTree as ET

NS = {
    "w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main",
    "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
}
REL_NS = "{http://schemas.openxmlformats.org/package/2006/relationships}"


def load_relationships(docx):
    rels = {}
    try:
        data = docx.read("word/_rels/document.xml.rels")
    except KeyError:
        return rels
    root = ET.fromstring(data)
    for rel in root:
        rel_id = rel.attrib.get("Id")
        target = rel.attrib.get("Target")
        if rel_id and target:
            rels[rel_id] = target
    return rels


def node_text(node, rels):
    parts = []
    for child in node.iter():
        if child.tag == f"{{{NS['w']}}}t" and child.text:
            parts.append(child.text)
        elif child.tag == f"{{{NS['w']}}}tab":
            parts.append("\t")
        elif child.tag == f"{{{NS['w']}}}br":
            parts.append("\n")
        elif child.tag == f"{{{NS['w']}}}hyperlink":
            rel_id = child.attrib.get(f"{{{NS['r']}}}id")
            if rel_id and rel_id in rels:
                parts.append(f" [{rels[rel_id]}]")
    return "".join(parts).strip()


def paragraph_text(p, rels):
    return node_text(p, rels)


def table_text(tbl, rels):
    rows = []
    for tr in tbl.findall(".//w:tr", NS):
        cells = []
        for tc in tr.findall("./w:tc", NS):
            text = " ".join(filter(None, (paragraph_text(p, rels) for p in tc.findall(".//w:p", NS))))
            cells.append(text)
        if any(cells):
            rows.append(" | ".join(cells))
    return "\n".join(rows)


def extract(path):
    with zipfile.ZipFile(path) as docx:
        rels = load_relationships(docx)
        root = ET.fromstring(docx.read("word/document.xml"))
    body = root.find("w:body", NS)
    if body is None:
        return ""

    blocks = []
    for child in body:
        if child.tag == f"{{{NS['w']}}}p":
            text = paragraph_text(child, rels)
            if text:
                blocks.append(text)
        elif child.tag == f"{{{NS['w']}}}tbl":
            text = table_text(child, rels)
            if text:
                blocks.append(text)
    return "\n\n".join(blocks)


for path in sys.argv[1:]:
    print(f"===== {path} =====")
    print(extract(path))
    print()
