mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=board  --file=./board.json --type=json --mode=upsert --drop
pause