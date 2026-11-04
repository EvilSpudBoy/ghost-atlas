"""Generate synthetic UI test data, not historical evidence."""
import json
from pathlib import Path
centers=[(31,78,16),(36,111,19),(50,12,8),(30,31,6),(-2,25,5),(14,77,5),(37,-92,2),(-12,-70,2)]
years=[-10000,-5000,-1000,1,500,1000,1500,1800,1900,1950,2000,2023]
previous=[0]*len(centers)
frames=[]
for year in years:
    cells=[]
    for i,(lat,lon,weight) in enumerate(centers):
        t=(year+10000)/12023
        pop=round(weight*100000*(.02+30*t**4))
        previous[i]+=round(pop*(.5+3*t))
        cells.append(dict(lat=lat,lon=lon,pop=pop,deaths=previous[i]))
    frames.append(dict(year=year,cells=cells))
metadata=dict(source="Synthetic demonstration only — NOT HYDE data",status="DEMO / NOT SCIENTIFIC",method="Illustrative fabricated values to test the interface.")
Path("public/data/atlas.json").write_text(json.dumps(dict(metadata=metadata,frames=frames),indent=2))
