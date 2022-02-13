import glob
import os
import shutil


for x in glob.glob('./asd/train/*'):
	if len(glob.glob(x+'/*'))<10:
		shutil.rmtree(x)
		print(x)