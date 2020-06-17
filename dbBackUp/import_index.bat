mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=index  --file=./index.json --type=json --mode=upsert --drop
pause