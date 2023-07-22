from tkinter import *
from random import choice
import pandas as pd
import pinyin
#import re

BACKGROUND_COLOR = "#B1DDC6"

# Read csv and convert to dictionary
try:
    df = pd.read_csv('data/words_to_learn.csv')
except FileNotFoundError:
    df = pd.read_csv('data/chinese_words.csv')
to_learn = df.to_dict(orient="records")

# # Delete Chinese words that have english characters
# chinese_words = df['Chinese'].tolist()
# frequency_count = df['Frequency Count'].tolist()
# english_words = df['English'].tolist()
# for index, item in enumerate(chinese_words):
#     a = re.search('[a-zA-Z]', item)
#     if a != None:
#         del chinese_words[index]
#         del frequency_count[index]
#         del english_words[index]
# # Create new DataFrame and export to csv
# new_df = pd.DataFrame({'Chinese': chinese_words, 'English': english_words, 'Frequency Count': frequency_count})
# new_df.to_csv("data/chinese_words.csv", index=False)

# Keep track of progress variables
correct_words = []
incorrect_words = []
side = 'front'
current_card = None
current_pinyin = None
show_pinyin = False


def hide_widget(widget):
    canvas.itemconfig(1, state='hidden')


def show_widget(widget):
    canvas.itemconfig(1, state='normal')


def next_card():
    global current_card
    global side
    global current_pinyin
    if side == 'back':
        flip_card()
    current_card = choice(to_learn)
    canvas.itemconfig(card_title, text="Chinese")
    canvas.itemconfig(card_word, text=current_card["Chinese"])
    current_pinyin = pinyin.get(current_card["Chinese"], delimiter=" ")
    canvas.itemconfig(card_pinyin, text=current_pinyin, fill="#000000")


def flip_card():
    global side
    global current_pinyin
    global show_pinyin
    if side == 'front':
        side = 'back'
        canvas.itemconfig(card_image, image=card_back_img)
        canvas.itemconfig(card_title, text="English", fill="#FFFFFF")
        canvas.itemconfig(card_word, text=current_card["English"], fill="#FFFFFF")
        canvas.itemconfig(card_pinyin, text="", fill="#000000")
    else:
        side = 'front'
        canvas.itemconfig(card_image, image=card_front_img)
        canvas.itemconfig(card_title, text="Chinese", fill="#000000")
        canvas.itemconfig(card_word, text=current_card["Chinese"], fill="#000000")
        canvas.itemconfig(card_pinyin, text=current_pinyin, fill="#000000")


def on_click(event):
    flip_card()


def incorrect():
    incorrect_words.append(current_card)
    to_learn.remove(current_card)
    incorrect_df = pd.DataFrame(incorrect_words)
    incorrect_df.to_csv("data/incorrect_words.csv", index=False)
    words_to_learn_df = pd.DataFrame(to_learn)
    words_to_learn_df.to_csv("data/words_to_learn.csv", index=False)
    next_card()


def correct():
    correct_words.append(current_card)
    to_learn.remove(current_card)
    correct_df = pd.DataFrame(correct_words)
    correct_df.to_csv("data/correct_words.csv", index=False)
    next_card()


window = Tk()
window.title("Flashy")
window.config(padx=50, pady=50, bg=BACKGROUND_COLOR)

canvas = Canvas(width=800, height=526, bg=BACKGROUND_COLOR, highlightthickness=0)
# image_img = PhotoImage(file="images/images.png")
card_back_img = PhotoImage(file="images/card_back.png")
card_front_img = PhotoImage(file="images/card_front.png")
card_image = canvas.create_image(400, 263, image=card_front_img)
card_title = canvas.create_text(400, 150, fill="#000000", font=("Ariel", 40, "italic"))
card_word = canvas.create_text(400, 263, fill="#000000", font=("Ariel", 60, "bold"))
card_pinyin = canvas.create_text(400, 363, fill="#000000", font=("Ariel", 60, "bold"))
# canvas.itemconfig(card_pinyin, state='hidden')
# card_show_pinyin = Button(highlightbackground="#FFFFFF", bg="#FFFFFF", text="Show Pinyin",
#                           command=lambda:show_widget(card_pinyin))#, height=3, width=10)
canvas.bind("<Button-1>", on_click)

# Buttons
correct_img = PhotoImage(file="images/right.png")
incorrect_img = PhotoImage(file="images/wrong.png")
wrong_button = Button(highlightbackground=BACKGROUND_COLOR, bg=BACKGROUND_COLOR, image=incorrect_img, command=incorrect)
correct_button = Button(highlightbackground=BACKGROUND_COLOR, bg=BACKGROUND_COLOR, image=correct_img, command=correct)

# Grid Layout
canvas.grid(column=0, row=0, columnspan=15, rowspan=10)
wrong_button.grid(column=5, row=10)
correct_button.grid(column=9, row=10)
# card_show_pinyin.grid(column=7, row=7)

# Set up flashcards
next_card()

window.mainloop()
