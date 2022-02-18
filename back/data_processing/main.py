import glob
import csv
import os
from random import shuffle
import shutil

# article_id,product_code,prod_name,product_type_no,product_type_name,
# product_group_name,graphical_appearance_no,graphical_appearance_name,
# colour_group_code,colour_group_name,perceived_colour_value_id,perceived_colour_value_name,
# perceived_colour_master_id,perceived_colour_master_name,department_no,department_name,index_code,
# index_name,index_group_no,index_group_name,section_no,section_name,garment_group_no,garment_group_name,detail_desc

type_dict = {}
type_set = set()
hnm_color_translate_dict = {
    "Black": "black",
	"White": "white",
	"Beige": "beige",
	"Grey": "grey",
	"Blue": "blue",
	"Pink": "pink",
	"Lilac Purple": "purple",
	"Red": "red",
	"Mole": "grey",
	"Orange": "orange",
	"Metal": "grey",
	"Brown": "brown",
	"Turquoise": "turquoise",
	"Yellow": "yellow",
	"Khaki green": "khaki",
	"Green": "green",
	"Yellowish Green": "green",
	"Bluish Green": "turquoise"
}
kaggle_color_translate_dict = {
    "Navy Blue": "blue",
	"Blue": "blue",
	"Silver": "grey",
	"Black": "black",
	"Grey": "grey",
	"Green": "green",
	"Purple": "purple",
	"White": "white",
	"Beige": "beige",
	"Brown": "brown",
	"Bronze": "brown",
	"Teal": "turquoise",
	"Copper": "brown",
	"Pink": "pink",
	"Off White": "white",
	"Maroon": "brown",
	"Red": "red",
	"Khaki": "khaki",
	"Orange": "orange",
	"Coffee Brown": "brown",
	"Yellow": "yellow",
	"Charcoal": "grey",
	"Gold": "yellow",
	"Steel": "grey",
	"Tan": "beige",
	"Magenta": "purple",
	"Lavender": "purple",
	"Sea Green": "turquoise",
	"Cream": "white",
	"Peach": "pink",
	"Olive": "green",
	"Skin": "beige",
	"Burgundy": "red",
	"Grey Melange": "grey",
	"Rust": "brown",
	"Rose": "red",
	"Lime Green": "green",
	"Mauve": "purple",
	"Turquoise Blue": "turquoise",
	"Metallic": "grey",
	"Mustard": "yellow",
	"Taupe": "brown",
	"Nude": "beige",
	"Mushroom Brown": "brown",
	"Fluorescent Green": "green"
}

hnm_gender_translate_dict = {
    "Womens Everyday Basics": "female",
    "Womens Lingerie": "female",
    "Womens Nightwear, Socks & Tigh": "female",
    "Men Underwear": "male",
    "Mama": "female",
    "Womens Small accessories": "female",
    "Men H&M Sport": "male",
    "Kids Boy": "male",
    "Girls Underwear & Basics": "female",
    "Mens Outerwear": "male",
    "Womens Big accessories": "female",
    "Womens Swimwear, beachwear": "female",
    "Boys Underwear & Basics": "male",
    "Men Accessories": "male",
    "Men Suits & Tailoring": "male",
    "Womens Everyday Collection": "female",
    "Men Shoes": "male",
    "Young Boy": "male",
    "Ladies Denim": "female",
    "Womens Trend": "female",
    "Young Girl": "female",
    "Womens Shoes": "female",
    "Womens Tailoring": "female",
    "Denim Men": "male",
    "Men Other": "male",
    "Womens Jackets": "female",
    "Men Other 2": "male",
    "Baby Boy": "male",
    "Womens Casual": "female",
    "Ladies H&M Sport": "female",
    "Baby Girl": "female",
    "Kids Girl": "female",
    "Womens Premium": "female",
    "Men Project": "male",
    "Men Edition": "male",
    "Ladies Other": "female"
}
kaggle_gender_translate_dict = {
    "Men": "male", 
    "Women": "female", 
    "Boys": "male", 
    "Girls": "female", 
    "Unisex": "unisex"
}

hnm_category_translate_dict = {
  "Vest top": "top,under",
  "Bra": "top,under",
  "Underwear Tights": "under,bottom",
  "Socks": "under,socks",
  "Leggings/Tights": "bottom,legging",
  "Sweater": "top,sweater",
  "Top": "top",
  "Trousers": "bottom,trouser",
  "Hair clip": "acc",
  "Pyjama jumpsuit/playsuit": "one,sleep",
  "Bodysuit": "one,setup",
  "Hair string": "acc",
  "Hoodie": "top,hoodie",
  "Hair/alice band": "acc",
  "Belt": "acc",
  "Boots": "shoes",
  "Bikini top": "top,swim",
  "Swimwear bottom": "bottom,swim",
  "Underwear bottom": "bottom,under",
  "Swimsuit": "one,swim",
  "Skirt": "bottom,skirt",
  "T-shirt": "top,t-shirt",
  "Dress": "one,dress",
  "Hat/beanie": "acc",
  "Kids Underwear top": "top,under",
  "Shorts": "bottom,short",
  "Shirt": "top,shirt",
  "Cap/peaked": "acc",
  "Pyjama set": "one,sleep",
  "Sneakers": "shoes",
  "Sunglasses": "acc",
  "Cardigan": "outer,cardigan",
  "Gloves": "acc",
  "Earring": "acc",
  "Bag": "bag",
  "Blazer": "outer,blazer",
  "Other shoe": "shoes",
  "Jumpsuit/Playsuit": "one,jumpsuit",
  "Sandals": "shoes",
  "Jacket": "outer,jacket",
  "Robe": "one,sleep",
  "Scarf": "acc",
  "Coat": "outer,coat",
  "Other accessories": "acc",
  "Polo shirt": "top,t-shirt",
  "Slippers": "shoes",
  "Night gown": "sleep,one",
  "Alice band": "acc",
  "Straw hat": "acc",
  "Hat/brim": "acc",
  "Tailored Waistcoat": "top,waistcoat",
  "Necklace": "acc",
  "Ballerinas": "one,dress",
  "Tie": "acc",
  "Pyjama bottom": "bottom,sleep",
  "Felt hat": "acc",
  "Bracelet": "acc",
  "Blouse": "top,shirt",
  "Watch": "acc",
  "Underwear body": "bottom,under",
  "Beanie": "acc",
  "Dungarees": "one,jumpsuit",
  "Outdoor trousers": "bottom,trouser",
  "Wallet": "acc",
  "Swimwear set": "one,swim",
  "Swimwear top": "top,swim",
  "Flat shoe": "shoes",
  "Garment Set": "one,setup",
  "Ring": "acc",
  "Wedge": "shoes",
  "Long John": "bottom,under",
  "Outdoor Waistcoat": "top,waistcoat",
  "Pumps": "shoes",
  "Flip flop": "shoes",
  "Braces": "one,setup",
  "Bootie": "shoes",
  "Heeled sandals": "shoes",
  "Hair ties": "acc",
  "Underwear corset": "top,under",
  "Underdress": "one,under",
  "Underwear set": "one,under",
  "Leg warmers": "under,socks",
  "Hairband": "acc",
  "Tote bag": "bag",
  "Weekend/Gym bag": "bag",
  "Backpack": "bag",
  "Earrings": "acc",
  "Bucket hat": "acc",
  "Flat shoes": "shoes",
  "Heels": "shoes",
  "Cap": "acc",
  "Shoulder bag": "bag",
  "Accessories set": "acc",
  "Headband": "acc",
  "Cross-body bag": "bag",
  "Moccasins": "shoes",
  "Pre-walkers": "shoes",
  "Bumbag": "bag",
  "Eyeglasses": "acc",
}

kaggle_category_translate_dict = {
"Shirts": "top,shirt",
"Jeans": "bottom,jean",
"Watches": "acc",
"Track Pants": "bottom,trouser",
"Tshirts": "top,t-shirt",
"Socks": "under,socks",
"Casual Shoes": "shoes",
"Belts": "acc",
"Flip Flops": "shoes",
"Handbags": "bag",
"Tops": "top",
"Bra": "top,under",
"Sandals": "shoes",
"Shoe Accessories": "acc",
"Sweatshirts": "top,sweatshirt",
"Formal Shoes": "shoes",
"Bracelet": "acc",
"Flats": "shoes",
"Waistcoat": "top,waistcoat",
"Sports Shoes": "shoes",
"Shorts": "bottom,short",
"Briefs": "bottom,under",
"Heels": "shoes",
"Sunglasses": "acc",
"Innerwear Vests": "under,top",
"Pendant": "acc",
"Scarves": "acc",
"Rain Jacket": "outer,jacket",
"Dresses": "one,dress",
"Night suits": "one,sleep",
"Skirts": "bottom,skirt",
"Wallets": "acc",
"Blazers": "outer,blazer",
"Ring": "acc",
"Clutches": "acc",
"Backpacks": "bag",
"Caps": "acc",
"Trousers": "bottom,trouser",
"Earrings": "acc",
"Camisoles": "top,under",
"Boxers": "bottom,under",
"Jewellery Set": "acc",
"Dupatta": "acc",
"Capris": "bottom,trouser",
"Bath Robe": "one,sleep",
"Mufflers": "acc",
"Tunics": "top",
"Jackets": "outer,jacket",
"Trunk": "bottom,under",
"Lounge Pants": "bottom,trouser",
"Necklace and Chains": "acc",
"Duffel Bag": "bag",
"Sports Sandals": "shoes",
"Sweaters": "top,sweater",
"Trolley Bag": "bag",
"Tracksuits": "one",
"Swimwear": "swim",
"Bangle": "acc",
"Nightdress": "one,sleep",
"Ties": "acc",
"Leggings": "bottom,legging",
"Messenger Bag": "bag",
"Accessory Gift Set": "acc",
"Jumpsuit": "one,jumpsuit",
"Suspenders": "acc",
"Robe": "top,sleep",
"Salwar and Dupatta": "acc",
"Patiala": "ingnore",
"Stockings": "bottom,under",
"Headband": "acc",
"Tights": "bottom,under",
"Lounge Tshirts": "top,t-shirt",
"Lounge Shorts": "bottom,short",
"Gloves": "acc",
"Wristbands": "acc",
"Ties and Cufflinks": "acc",
"Stoles": "acc",
"Shapewear": "bottom,under",
"Nehru Jackets": "outer,jacket",
"Cufflinks": "acc",
"Jeggings": "bottom,jean",
"Rompers": "one,setup",
"Booties": "shoes",
"Hair Accessory": "acc",
"Rucksacks": "bag",
"Lehenga Choli": "one,dress",
"Clothing Set": "one,setup",
"Hat": "acc",
"Rain Trousers": "bottom,trouser",
"Suits": "one,setup",
}

f = open('dataset.csv','w')

#H&M 데이터
with open('./hnm_data/articles.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile)
    key_index = {}
    for i,row in enumerate(spamreader):
        temp = []

        if i == 0:
            key_index = {value:index for index,value in enumerate(row)}
            continue
        
        # 색 확인
        if row[key_index['perceived_colour_master_name']] in hnm_color_translate_dict:
            temp.append(hnm_color_translate_dict[row[key_index['perceived_colour_master_name']]])

        # 성별 확인
        if row[key_index['section_name']] in hnm_gender_translate_dict:
            temp.append(hnm_gender_translate_dict[row[key_index['section_name']]])

        # 카테고리 확인
        if row[key_index['product_type_name']] in hnm_category_translate_dict:
            temp.append(hnm_category_translate_dict[row[key_index['product_type_name']]])
        
        # print()
            f.write("gs://cloth_classfication/"+row[0]+".jpg,"+",".join(temp)+"\n")
        


with open('./kaggle_data_label.csv', newline='') as csvfile:
    spamreader = csv.reader(csvfile)
    key_index = {}
    for i,row in enumerate(spamreader):
        temp = []
        if i == 0:
            key_index = {value:index for index,value in enumerate(row)}
            continue
        
        # 색 확인
        if row[key_index['baseColour']] in kaggle_color_translate_dict:
            temp.append(kaggle_color_translate_dict[row[key_index['baseColour']]])

        # 성별 확인
        if row[key_index['gender']] in kaggle_gender_translate_dict:
            temp.append(kaggle_gender_translate_dict[row[key_index['gender']]])

        # 카테고리 확인
        if row[key_index['articleType']] in kaggle_category_translate_dict:
            temp.append(kaggle_category_translate_dict[row[key_index['articleType']]])
        
            f.write("gs://cloth_classfication/"+row[0]+".jpg,"+",".join(temp)+"\n")


f.close()

# for ts in type_set:
#     # if not os.path.exists('./asd/test/'+ts):
#     #     os.makedirs('./asd/test/'+ts)
#     if not os.path.exists('./asd/train/'+ts):
#         os.makedirs('./asd/train/'+ts)


# for x in glob.glob('./archive/images_512_512/*/*.jpg'):
#     temp_key = x.split('/')[-1].split('.')[0]
#     # shuffle(aaa)
#     # if aaa[0] == 1:
#     shutil.copy(x, './asd/train/'+type_dict[temp_key]+'/'+temp_key+'.jpg')
#     # else:
#     #     shutil.copy(x, './asd/test/'+type_dict[temp_key]+'/'+temp_key+'.jpg')
