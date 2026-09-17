from pathlib import Path
import sys

from fontTools.ttLib import TTFont


font_path = Path(sys.argv[1])
font = TTFont(font_path, recalcTimestamp=False)
names = {
    1: "SWJeon OG SemiBold",
    3: "Version 1.301;SWJEON;SWJeonOG-SemiBold",
    4: "SWJeon OG SemiBold",
    6: "SWJeonOG-SemiBold",
    16: "SWJeon OG",
    17: "SemiBold",
}

for record in font["name"].names:
    if record.nameID in names:
        record.string = names[record.nameID].encode(record.getEncoding())

font.save(font_path)
