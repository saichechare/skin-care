import smtplib
server = smtplib.SMTP('smtp.gmail.com',587)
server.starttls()

server.login('skincaredoctor108@gmail.com','ynas zcoz khtc apay')
server.sendmail('skincaredoctor108@gmail.com','sp2130ji@gmail.com','Hi skincare doctor')
print("mail send")