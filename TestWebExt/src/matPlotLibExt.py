import matplotlib.pyplot as plt

# def savePie()
labels = 'Frogs', 'Hogs', 'Dogs'
sizes = [15, 30, 45]
explode = (0.1, 0, 0)  

fig1, ax1 = plt.subplots()
ax1.pie(sizes, explode=explode, labels=labels, autopct='%1.1f%%',
        shadow=True, startangle=90)

ax1.axis('equal') 
plt.savefig("temp.html", format="svg")

plt.show()