mongoimport --uri="mongodb://localhost:27017/work_management"  --collection=user  --file=./user.json --type=json --mode=upsert
pause