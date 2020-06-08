mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=task  --file=./task.json --type=json --mode=upsert
pause