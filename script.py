import PyPDF2

YEAR = "2020"

class Numero:
  def __init__(self, number, amount):
    self.number = number
    self.amount = amount

def clean_headers(text):
    headers_to_clean = ["Decena", "Unidad", "Centena", "Mil", "Dos mil", "Tres mil", "Cuatro mil",
        "Cinco mil", "Seis mil", "Siete mil", "Ocho mil", "Nueve mil", "Diez mil",
        "Trece mil", "Veinte mil", "Veintiún mil", "Veintidós mil", "Veintitrés mil", "Veinticuatro ",
        "Veinticinco mil", "Veintiséis mil", "Veintisiete mil", "Veintiocho mil",
        "Veintinueve",
        "Cuarenta",
        "Treinta",
        "                              ",
        " mil",
        "y ocho mil ",
        "y ocho",
        "Once","Doce","Trece","Catorce","Quince","Dieciséis","Diecisiete","Dieciocho","Diecinueve",
        "Veinte", "Veintiuno", "Veintidos", "Veintetres", "Veinticuatro", "Veinticinco", "Veintiseis",
        "mil","y un","y dos","y tres","y cuatro","y cinco","y seis","y siete","y ocho","y nueve",
        "Cincuenta", "Sesenta      ", "Sesenta", "Setenta", "Ochenta", "Noventa", "Cien","Noventa "
    ]
    for header in headers_to_clean:
        text = text.replace(header, "")
    return text


def clean_row(text):
    separators = [" . . . . . ", " . . t . . ", " . . c . . ", " . . a . . ",
                  ". . . . ."  , ". . t . ."  , ". . c . .", ". . a . .", " . . a.  . "]
    for sep in separators:
        text = text.replace(sep, "|||")
    return text

def has_big_prize(text):
    return  ". a ." in text and " . . a . . " not in text

def get_big_prize(cleaned_item, cleaned_list):
    separator = " . a . "
    index = cleaned_item.find(separator)
    first_number = cleaned_item[0: index]
    first_prize = cleaned_item[index + + len(separator):index + len(separator) + 4]
    cleaned_list.append(Numero(first_number, first_prize))

    is_el_gordo = "1.250.000" in cleaned_item or "4.000.000" in cleaned_item

    iter = cleaned_item[index + len(separator) + (5 if is_el_gordo else 4):]
    big_number = iter[:5]
    big_prize = iter[5:iter.find(separator) - 5]
    cleaned_list.append(Numero(big_number, big_prize))

    second_part = iter[iter.find("EUROS") + 5:]

    second_number = second_part[:5]
    second_prize = second_part[len(second_part) - 4:]
    cleaned_list.append(Numero(second_number, second_prize))


def write_output(list, year):
    file = f"out/{year}_unclassified.txt"
    textfile = open(file, "w")
    for element in list:
        textfile.write(element[0] + "\n")
    textfile.close()
    print(f"Written file: {file}")


def write_numbers(list, year):
    file = f"out/{year}_numbers.json"
    textfile = open(file, "w")
    head = '{"year": "' + str(year) + '", "numbers": ['
    textfile.write(head)
    for number in list:
        numberJson = '{"n": "' + number.number + '", "p": "' + number.amount + '"}'
        if number != list[-1]:
            numberJson += ","
        textfile.write(numberJson)
        #textfile.write(number.number + " " + number.amount + "\n")
    close = "]}"
    textfile.write(close)
    textfile.close()
    print(f"Written file: {file}")


def has_another_prize(pr):
    return ".000EUROS" in pr or ".000DE" in pr


def process_page(pageObj, cleaned_list, unclassified):
    output = pageObj.extractText()
    output = clean_headers(output)
    lst = output.split("\n")
    for item in lst:
        if item != '':
            cleaned_item = clean_row(item)
            splited_item = cleaned_item.split("|||")
            if len(splited_item) == 2 and "EUROS" not in cleaned_item:
                numero = Numero(splited_item[0], splited_item[1])
                cleaned_list.append(numero)
            else:
                if has_big_prize(cleaned_item):
                    get_big_prize(cleaned_item, cleaned_list)
                elif has_another_prize(cleaned_item):
                    clean_euros = cleaned_item[:cleaned_item.find("EUROS")]
                    cleaned_list.append(Numero(clean_euros[:5], clean_euros[5:] + "EUROS"))
                else:
                    unclassified.append(splited_item)


def main():
    pdfFileObj = open(f'data/lista-loteria-navidad-{YEAR}.pdf', 'rb')
    pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
    num_pages = pdfReader.numPages
    print(f"Number of pages: {str(num_pages)}")

    cleaned_list = []
    unclassified = []
    for number in range(num_pages):
        pageObj = pdfReader.getPage(number)
        process_page(pageObj, cleaned_list, unclassified)

    write_numbers(cleaned_list, YEAR)
    write_output(unclassified, YEAR)


if __name__ == "__main__":
    main()