import glob
import threading
from PIL import Image
import os


files = glob.glob('./kaggle_data/*.jpg')

class Worker(threading.Thread):
	def __init__(self,name,index):
		super().__init__()
		self.name = name
		self.index = index

	def run(self):
		print("sub thread start ", threading.currentThread().getName())
		for f in files[5000*self.index:5000*(self.index+1)]:
			Image.open(f).resize((512,512)).save('./kagge_data_resize/'+f.split('/')[-1])
		print("sub thread end ", threading.currentThread().getName())

print("main thread start")
if not os.path.exists('./kaggle_data_resize'):
	os.makedirs('./kaggle_data_resize')

for i in range(9):
	name = "thread {}".format(i)
	t = Worker(name,i)                # sub thread 생성
	t.start()                       # sub thread의 run 메서드를 호출

print("main thread end")



