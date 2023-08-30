# Chinese-Flash-Cards
 
Educational application to assist in learning Chinese (Mandarin). Flashcards to memorize 1000 of the most everyday used words. Includes Chinese to English translations, pinyin, and narrator to help with pronunciation. Currently looking into hooking up Google Translate, and ChatGPT to generate and translate sentences. Created using Tkinter.

Features:
- Flashcards of over 1000 of the most commonly used Chinese words
- Chinese Pinyin, narrator, and the English translation for each card
- Mark works 'known' `✓`  or 'unknown' `x`
- Cards marked as known will not be shown again in the stack
- Click the card to flip it and see the translation
- Extra csv files will be generated in the data directory after you run for more review
 
Chinese words taken from: https://github.com/hermitdave/FrequencyWords/tree/master/content/2018/zh_cn

TODO:
- Hookup ChatGPT to generate Chinese sentences
- google translate -> https://pypi.org/project/googletrans/
- hook up Google translate to do automatic translations (for each character and sentence) -> https://codelabs.developers.google.com/codelabs/cloud-translation-python3#0
- Create another flash card stack by web scraping https://studychinese101.com/1000-chinese-sentences-in-daily-life.html
- Look into implementing list from HSK -> https://en.wiktionary.org/wiki/Appendix:HSK_list_of_Mandarin_words

External Packages Used:
- Chinese Pinyin: https://pypi.org/project/pinyin/
- Google Translate Narrator: https://pypi.org/project/google-speech/

How to run:
- Python 3.11.4 is highly recommended to resolve tkinter issues
- Download repository
- Open downloaded repository with a command line interface
- run `pip install pandas pinyin google-speech sox`
- make sure you have sox installed! For MacOS terminal: `brew install sox`. This is used to run google-speech
- run `python main.py`
- App window will open
- Click the card to see the translation, and once again to see original card
- Click the `x` button if you don't know the word
- Click the `✓` button if you know the word
- Progress is saved automatically
- View data/ directory for more info

Card Front without pinyin:

![alt text](https://github.com/J0K3Rn/Chinese-Flash-Cards/blob/main/screenshots/card_front_no_pinyin.png?raw=true) 

Card Front with pinyin:

![alt text](https://github.com/J0K3Rn/Chinese-Flash-Cards/blob/main/screenshots/card_front_with_pinyin.png?raw=true) 

Card Back:

![alt text](https://github.com/J0K3Rn/Chinese-Flash-Cards/blob/main/screenshots/card_back.png?raw=true) 
