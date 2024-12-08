from flask import Flask,render_template,request
import openpyxl
import pandas as pd
import time
import smtplib
import mysql.connector as c
app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')
@app.route('/appointment')
def appointment():
    return render_template('appointment.html')

@app.route('/getdata', methods=['POST'])
def getdata():
    # Extract form data
    name = request.form.get('name')
    email = request.form.get('email')
    message = request.form.get('message')

    # Define the Excel file and sheet name
    excel_file = "form_data.xlsx" 
    

    # Create or open the Excel file
    try:
        workbook = openpyxl.load_workbook(excel_file)  # Open if exists
        sheet = workbook.active
    except FileNotFoundError:
        workbook = openpyxl.Workbook()  # Create new if doesn't exist
        sheet = workbook.active
        sheet.append(["Name", "Email", "Message"])  # Add headers

    # Append the data to the Excel file
    sheet.append([name, email, message])
    workbook.save(excel_file)  # Save the file
     
    server = smtplib.SMTP('smtp.gmail.com',587)
    server.starttls()
    server.login('skincaredoctor108@gmail.com','ynas zcoz khtc apay')
    server.sendmail('skincaredoctor108@gmail.com','{}'.format(email),'Thank you for sending message your problem will be shourt out as soon as possible... \n Your Problem :-{}'.format(message))
    return " Your Message Send to Skin Care Doctor <br> message send sucessfull ...."

    
# creating appointment
@app.route('/create', methods=["POST"])
def data_insertion_Db():
    full_name = request.form.get('name')
    gender = request.form.get('gender')
    region = request.form.get('region')
    Email = request.form.get('email')
    phone = request.form.get('phone')
    Doctor_name = request.form.get('options')
    problem = request.form.get('problem')
    additional_notes = request.form.get('message')
    con = c.connect(host="localhost",user='root',password="8530",database="skincare")
    cursor = con.cursor()
    q1 = """INSERT INTO user_app (full_name, gender, region, email, phone_num, Doctor_name, problem, add_note)
                   VALUES (%s, %s, %s, %s, %s,%s, %s, %s)"""
    data = (full_name, gender, region, Email, phone, Doctor_name, problem, additional_notes)

     
    cursor.execute(q1,data)
    con.commit()
    cursor.close()
    con.close()
    
    # sending the  email to user
    server = smtplib.SMTP('smtp.gmail.com',587)
    server.starttls()
    server.login('skincaredoctor108@gmail.com','ynas zcoz khtc apay')
    server.sendmail('skincaredoctor108@gmail.com','{}'.format(Email),' {} Thank You!... \n You will get you appointment details with {} as soon as possible \n For Your Problem :-{}'.format(full_name,Doctor_name,problem))
   
    
    return "submitted"
    


if __name__ == '__main__':
    app.run(debug=True)
