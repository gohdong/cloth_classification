import glob
import threading
from PIL import Image


files = glob.glob('./images/*.jpg')

class Worker(threading.Thread):
	def __init__(self,name,index):
		super().__init__()
		self.name = name
		self.index = index

	def run(self):
		print("sub thread start ", threading.currentThread().getName())
		for f in files[5000*self.index:5000*(self.index+1)]:
			Image.open(f).resize((512,512)).save('./resize/'+f.split('/')[-1])
		print("sub thread end ", threading.currentThread().getName())

print("main thread start")
for i in range(9):
	name = "thread {}".format(i)
	t = Worker(name,i)                # sub thread 생성
	t.start()                       # sub thread의 run 메서드를 호출

print("main thread end")



