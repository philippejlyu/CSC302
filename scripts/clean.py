from geopy.geocoders import Nominatim
import csv
geolocator = Nominatim(user_agent="Crime")
with open('../data/crimedata.csv') as csv_file, open('../data/clean.csv', 'w', newline='') as new_csv:
    csv_reader = csv.reader(csv_file, delimiter=',')
    csv_writer = csv.writer(new_csv)
    headers = next(csv_reader, None) + ['latitude', 'longitude']
    if headers:
        csv_writer.writerow(headers)
    count = 0
    for row in csv_reader:
        if len(row[3]) > 0:
            location = geolocator.geocode({'country': 'United States', "postalcode": row[3]})
            if location is not None:
                row.extend([location.latitude, location.longitude])
                csv_writer.writerow(row)    
        count += 1
        print(count)