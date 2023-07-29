import tkinter as tk
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


class App(object):
    def __init__(self):
        window.title("Flashy")
        window.config(padx=50, pady=50, bg=BACKGROUND_COLOR)

        self.canvas = tk.Canvas(width=800, height=526, bg=BACKGROUND_COLOR, highlightthickness=0)
        # image_img = PhotoImage(file="images/images.png")
        self.card_back_img = tk.PhotoImage(file="images/card_back.png")
        self.card_front_img = tk.PhotoImage(file="images/card_front.png")
        self.card_image = self.canvas.create_image(400, 263, image=self.card_front_img)
        self.card_title = self.canvas.create_text(400, 150, fill="#000000", font=("Ariel", 40, "italic"))
        self.card_word = self.canvas.create_text(400, 263, fill="#000000", font=("Ariel", 60, "bold"))
        self.card_pinyin_label = self.canvas.create_text(400, 363, fill="#000000", font=("Ariel", 60, "bold"))
        self.canvas.itemconfig(self.card_pinyin_label, state='hidden')
        self.show_pinyin_button = tk.Button(window, highlightbackground="#FFFFFF", bg="#FFFFFF", text="Show Pinyin", command=self.show_pinyin)  # , height=3, width=10)
        self.canvas.bind("<Button-1>", self.on_click)

        # Buttons
        self.correct_img = tk.PhotoImage(file="images/right.png")
        self.incorrect_img = tk.PhotoImage(file="images/wrong.png")
        self.wrong_button = tk.Button(highlightbackground=BACKGROUND_COLOR, bg=BACKGROUND_COLOR, image=self.incorrect_img, command=self.incorrect)
        self.correct_button = tk.Button(highlightbackground=BACKGROUND_COLOR, bg=BACKGROUND_COLOR, image=self.correct_img, command=self.correct)

        # Grid Layout
        self.canvas.grid(column=0, row=0, columnspan=15, rowspan=10)
        self.wrong_button.grid(column=5, row=10)
        self.correct_button.grid(column=9, row=10)
        self.show_pinyin_button.grid(column=7, row=7)

        # Set up flashcards
        self.next_card()

    def show_pinyin(self):
        global show_pinyin
        show_pinyin = True
        self.show_pinyin_button.lower()  # Lowers button below canvas. i.e. out of view. Much easier than destroying
        # self.show_pinyin_button.destroy()
        self.canvas.itemconfig(self.card_pinyin_label, state='normal')

    def flip_card(self):
        global side
        global current_card
        global current_pinyin
        global show_pinyin
        if side == 'front':
            side = 'back'
            self.canvas.itemconfig(self.card_image, image=self.card_back_img)
            self.canvas.itemconfig(self.card_title, text="English", fill="#FFFFFF")
            self.canvas.itemconfig(self.card_word, text=current_card["English"], fill="#FFFFFF")
            self.canvas.itemconfig(self.card_pinyin_label, text="", fill="#000000")
            if not show_pinyin:
                # If pinyin is not shown, hide button on back
                self.show_pinyin_button.lower()
        else:
            side = 'front'
            self.canvas.itemconfig(self.card_image, image=self.card_front_img)
            self.canvas.itemconfig(self.card_title, text="Chinese", fill="#000000")
            self.canvas.itemconfig(self.card_word, text=current_card["Chinese"], fill="#000000")
            self.canvas.itemconfig(self.card_pinyin_label, text=current_pinyin, fill="#000000")
            if not show_pinyin:
                # If pinyin is shown, show again on front
                self.show_pinyin_button.lift()

    def next_card(self):
        global current_card
        global side
        global current_pinyin
        global show_pinyin
        if side == 'back':
            self.flip_card()
        current_card = choice(to_learn)
        self.canvas.itemconfig(self.card_title, text="Chinese")
        self.canvas.itemconfig(self.card_word, text=current_card["Chinese"])
        current_pinyin = pinyin.get(current_card["Chinese"], delimiter=" ")
        self.canvas.itemconfig(self.card_pinyin_label, text=current_pinyin, fill="#000000")

        # Reset Pinyin button states for next card
        self.canvas.itemconfig(self.card_pinyin_label, state='hidden')
        self.show_pinyin_button.lift()
        show_pinyin = False

    def correct(self):
        global current_card
        correct_words.append(current_card)
        to_learn.remove(current_card)
        correct_df = pd.DataFrame(correct_words)
        correct_df.to_csv("data/correct_words.csv", index=False)
        self.next_card()

    def incorrect(self):
        global current_card
        incorrect_words.append(current_card)
        to_learn.remove(current_card)
        incorrect_df = pd.DataFrame(incorrect_words)
        incorrect_df.to_csv("data/incorrect_words.csv", index=False)
        words_to_learn_df = pd.DataFrame(to_learn)
        words_to_learn_df.to_csv("data/words_to_learn.csv", index=False)
        self.next_card()

    def on_click(self, event):
        self.flip_card()


window = tk.Tk()
a = App()

window.mainloop()
