import mysql.connector as c

con = c.connect(host="localhost",user='root',password="8530",database='mydb')
print("connected")