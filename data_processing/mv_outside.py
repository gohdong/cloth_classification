import glob
import os
import shutil

for i,x in enumerate(glob.glob('./archive/images_512_512/*/*.jpg')):
    temp_key = x.split('/')[-1].split('.')[0]
    if not os.path.exists('hnm_images/'+str(i%10)):
        os.makedirs('hnm_images/'+str(i%10))
    # shuffle(aaa)
    # if aaa[0] == 1:
    shutil.copy(x,'hnm_images/'+str(i%10)+'/'+temp_key+'.jpg')
    # else:
    #     shutil.copy(x, './asd/test/'+type_dict[temp_key]+'/'+temp_key+'.jpg')