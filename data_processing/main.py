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
	"Pink": "pinke",
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
  "Vest top": "top",
  "Bra": "underwear",
  "Underwear Tights": "underwear",
  "Socks": "underwear",
  "Leggings/Tights": "bottom",
  "Sweater": "top",
  "Top": "top",
  "Trousers": "bottom",
  "Hair clip": "acc",
  "Umbrella": "acc",
  "Pyjama jumpsuit/playsuit": "sleepwear",
  "Bodysuit": "onepiece",
  "Hair string": "acc",
  "Hoodie": "top",
  "Hair/alice band": "acc",
  "Belt": "acc",
  "Boots": "shoes",
  "Bikini top": "swimwear",
  "Swimwear bottom": "swimwear",
  "Underwear bottom": "underwear",
  "Swimsuit": "swimwear",
  "Skirt": "bottom",
  "T-shirt": "top",
  "Dress": "onepiece",
  "Hat/beanie": "acc",
  "Kids Underwear top": "underwear",
  "Shorts": "bottom",
  "Shirt": "top",
  "Cap/peaked": "acc",
  "Pyjama set": "sleepwear",
  "Sneakers": "shoes",
  "Sunglasses": "acc",
  "Cardigan": "outer",
  "Gloves": "acc",
  "Earring": "acc",
  "Bag": "bag",
  "Blazer": "outer",
  "Other shoe": "shoes",
  "Jumpsuit/Playsuit": "onepiece",
  "Sandals": "shoes",
  "Jacket": "outer",
  "Costumes": "ignore",
  "Robe": "sleepwear",
  "Scarf": "acc",
  "Coat": "outer",
  "Other accessories": "acc",
  "Polo shirt": "top",
  "Slippers": "shoes",
  "Night gown": "sleepwear",
  "Alice band": "acc",
  "Straw hat": "acc",
  "Hat/brim": "acc",
  "Tailored Waistcoat": "top",
  "Necklace": "acc",
  "Ballerinas": "onepiece",
  "Tie": "acc",
  "Pyjama bottom": "sleepwear",
  "Felt hat": "acc",
  "Bracelet": "acc",
  "Blouse": "top",
  "Outdoor overall": "sport",
  "Watch": "acc",
  "Underwear body": "underwear",
  "Beanie": "acc",
  "Giftbox": "ignore",
  "Sleeping sack": "sleepwear",
  "Dungarees": "onepiece",
  "Outdoor trousers": "bottom",
  "Wallet": "acc",
  "Swimwear set": "swimwear",
  "Swimwear top": "swimwear",
  "Flat shoe": "shoes",
  "Garment Set": "ignore",

  "Ring": "acc",
  "Waterbottle": "ignore",
  "Wedge": "shoes",
  "Long John": "underwear",
  "Outdoor Waistcoat": "sport",
  "Pumps": "shoes",
  "Flip flop": "shoes",
  "Braces": "onepiece",
  "Bootie": "shoes",
  "Fine cosmetics": "ignore",
  "Heeled sandals": "shoes",
  "Nipple covers": "ignore",
  "Chem. cosmetics": "ignore",
  "Soft Toys": "ignore",
  "Hair ties": "acc",
  "Underwear corset": "underwear",
  "Bra extender": "underwear",
  "Underdress": "underwear",
  "Underwear set": "underwear",
  "Sarong": "swimwear",
  "Leg warmers": "underwear",
  "Blanket": "ignore",
  "Hairband": "acc",
  "Tote bag": "bag",
  "Weekend/Gym bag": "bag",
  "Cushion": "ignore",
  "Backpack": "bag",
  "Earrings": "acc",

  "Bucket hat": "acc",
  "Flat shoes": "shoes",
  "Heels": "shoes",
  "Cap": "acc",
  "Shoulder bag": "bag",
  "Side table": "ignore",
  "Accessories set": "acc",
  "Headband": "acc",
  "Baby Bib": "ignore",
  "Keychain": "ignore",
  "Dog Wear": "ignore",
  "Washing bag": "ignore",
  "Sewing kit": "ignore",
  "Cross-body bag": "bag",
  "Moccasins": "shoes",
  "Towel": "ignore",
  "Wood balls": "ignore",
  "Zipper head": "ignore",
  "Mobile case": "ignore",
  "Pre-walkers": "shoes",
  "Toy": "ignore",
  "Marker pen": "ignore",
  "Bumbag": "bag",
  "Dog wear": "ignore",
  "Eyeglasses": "acc",
  "Wireless earphone case": "ignore",
  "Stain remover spray": "ignore",
  "Clothing mist": "ignore"
}
kaggle_category_translate_dict = {
    "Shirts": "top",
    "Jeans": "bottom",
    "Watches": "acc",
    "Track Pants": "bottom",
    "Tshirts": "top",
    "Socks": "underwear",
    "Casual Shoes": "shoes",
    "Belts": "acc",
    "Flip Flops": "shoes",
    "Handbags": "bag",
    "Tops": "top",
    "Bra": "underwear",
    "Sandals": "shoes",
    "Shoe Accessories": "acc",
    "Sweatshirts": "top",
    "Deodorant": "ignore",
    "Formal Shoes": "shoes",
    "Bracelet": "acc",
    "Lipstick": "ignore",
    "Flats": "shoes",
    "Kurtas": "onepiece",
    "Waistcoat": "top",
    "Sports Shoes": "shoes",
    "Shorts": "bottom",
    "Briefs": "underwear",
    "Sarees": "onepiece",
    "Perfume and Body Mist": "ignore",
    "Heels": "shoes",
    "Sunglasses": "acc",
    "Innerwear Vests": "underwear",
    "Pendant": "acc",
    "Nail Polish": "ignore",
    "Laptop Bag": "ignore",
    "Scarves": "acc",
    "Rain Jacket": "outer",
    "Dresses": "onepiece",
    "Night suits": "sleepwear",
    "Skirts": "bottom",
    "Wallets": "acc",
    "Blazers": "outer",
    "Ring": "acc",
    "Kurta Sets": "onepiece",
    "Clutches": "acc",
    "Shrug": "outer",
    "Backpacks": "bag",
    "Caps": "acc",
    "Trousers": "bottom",
    "Earrings": "acc",
    "Camisoles": "underwear",
    "Boxers": "underwear",
    "Jewellery Set": "acc",
    "Dupatta": "acc",
    "Capris": "bottom",
    "Lip Gloss": "ignore",
    "Bath Robe": "sleepwear",
    "Mufflers": "acc",
    "Tunics": "top",
    "Jackets": "outer",
    "Trunk": "underwear",
    "Lounge Pants": "bottom",
    "Face Wash and Cleanser": "ignore",
    "Necklace and Chains": "acc",
    "Duffel Bag": "bag",
    "Sports Sandals": "shoes",
    "Foundation and Primer": "ignore",
    "Sweaters": "top",
    "Free Gifts": "ignore",
    "Trolley Bag": "bag",
    "Tracksuits": "sport",
    "Swimwear": "swimwear",
    "Shoe Laces": "ignore",
    "Fragrance Gift Set": "ignore",
    "Bangle": "acc",
    "Nightdress": "sleepwear",
    "Ties": "acc",
    "Baby Dolls": "ignore",
    "Leggings": "bottom",
    "Highlighter and Blush": "ignore",
    "Travel Accessory": "ignore",
    "Kurtis": "onepiece",
    "Mobile Pouch": "ignore",
    "Messenger Bag": "bag",
    "Lip Care": "ignore",
    "Face Moisturisers": "ignore",
    "Compact": "ignore",
    "Eye Cream": "ignore",
    "Accessory Gift Set": "acc",
    "Beauty Accessory": "ignore",
    "Jumpsuit": "onepiece",
    "Kajal and Eyeliner": "ignore",
    "Water Bottle": "ignore",
    "Suspenders": "acc",
    "Lip Liner": "ignore",
    "Robe": "sleepwear",
    "Salwar and Dupatta": "acc",
    "Patiala": "bottom",
    "Stockings": "underwear",
    "Eyeshadow": "ignore",
    "Headband": "acc",
    "Tights": "underwear",
    "Nail Essentials": "ignore",
    "Churidar": "onepiece",
    "Lounge Tshirts": "top",
    "Face Scrub and Exfoliator": "ignore",
    "Lounge Shorts": "bottom",
    "Gloves": "acc",
    "Mask and Peel": "ignore",
    "Wristbands": "acc",
    "Tablet Sleeve": "ignore",
    "Ties and Cufflinks": "acc",
    "Footballs": "ignore",
    "Stoles": "acc",
    "Shapewear": "underwear",
    "Nehru Jackets": "top",
    "Salwar": "onepiece",
    "Cufflinks": "acc",
    "Jeggings": "underwear",
    "Hair Colour": "ignore",
    "Concealer": "ignore",
    "Rompers": "onepiece",
    "Body Lotion": "ignore",
    "Sunscreen": "ignore",
    "Booties": "shoes",
    "Waist Pouch": "ignore",
    "Hair Accessory": "acc",
    "Rucksacks": "bag",
    "Basketballs": "ignore",
    "Lehenga Choli": "onepiece",
    "Clothing Set": "onepiece",
    "Mascara": "ignore",
    "Toner": "ignore",
    "Cushion Covers": "ignore",
    "Key chain": "ignore",
    "Makeup Remover": "ignore",
    "Lip Plumper": "ignore",
    "Umbrellas": "acc",
    "Face Serum and Gel": "ignore",
    "Hat": "acc",
    "Mens Groocming Kit": "ignore",
    "Rain Trousers": "bottom",
    "Body Wash and Scrub": "ignore",
    "Suits": "onepiece",
    "Ipad": "ignore"
}

f = open('dataset.csv','w')

#H&M 데이터
with open('./archive/articles.csv', newline='') as csvfile:
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
        


with open('./styles.csv', newline='') as csvfile:
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
