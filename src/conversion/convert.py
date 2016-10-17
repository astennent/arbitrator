import csv

with open('Guardian Coding 3.0_Sept- 26-2016.csv', 'rb') as csvfile:
    delimiter = ','
    headers = None
    headers2 = None
    reader = csv.reader(csvfile, delimiter = delimiter)

    for row in reader:
        if headers == None:
            headers = row
            continue
        if headers2 == None:
            headers2 = row
            continue
        break

    coderIdIndex = headers2.index('Q100 - Name of Coder')
    coderData = dict([])

    codableHeaders = []
    for header in headers2:
        if header.startswith('Q'):
            codableHeaders.append(header)

    for row in reader:
        coder = row[coderIdIndex]
        if coder == '':
            coder = 'Unknown'
        if coder not in coderData:
            coderData[coder] = []

        case = []
        for index, cell in enumerate(row):
            isCodable = headers2[index] in codableHeaders
            if isCodable:
                case.append(cell)

        coderData[coder].append(case)

    for coder in coderData.keys():
        outputFile = open(coder + '.csv', 'wb') 
        writer = csv.writer(outputFile, delimiter = ',')
        writer.writerow(codableHeaders)

        data = coderData[coder]
        for row in data:
            writer.writerow(row)


        
