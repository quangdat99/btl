mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=list  --file=./list.json --type=json --mode=upsert --drop
pause