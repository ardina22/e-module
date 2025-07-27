# Tipe Data Dart

###	Int (integer)
integer merupakan tipe data bilangan bulat
```dart
   int usia = 17;
```

### double 		
double merupakan tipe data bilangan desimal
```dart
  double tinggiBadan = 182.5;
```

### num       
num merupakan tipe data yang bisa menerima nilai integer dan double
```dart
num tinggiBadan = 182.5;
num usia = 17;
```

### String		
String merupakan tipe data yang berisi kumpulan karakter dengan diapit petik dua atau petik satu.
```dart
String nama = "Roni Saputra, ";
String kelas = 'XII RPL';
```
- Menggabungkan 2 buah string
  
```dart
var data = nama + kelas;
  print(data);
```

- String Interpolation --> expression (memanggil variabel ke dalam string)
```dart
  String data = "$nama ${kelas}";
  print(data);
```

- String Multiline --> string yang panjangnya lebih dari satu baris, diapit menggunakan tiga tanda petik
```dart
String keterangan = '''
jika string sangat panjang dan tidak bisa dituliskan 
dalam satu baris maka harus menggunakan multiline string
dengan diapit kutip tiga
''';
print(keterangan);
```
    
### bool (Boolean)	
boolean memiliki 2 nilai yaitu false true

### list 
identik dengan konsep array dalam bahasa pemrograman lain.Dengan memakai library dart : core memungkinkan pembuatan dan manipulasi tipe data ini melalui class List 

### map : mewakili sekumpulan nilai sebagai pasangan key-value. Dengan memakai library dart : core memungkinkan pembuatan dan manipulasi tipe data ini melalui class List 

  
# Null & Nullabel Types
Syntax:
```dart
tipe_data? nama_variabel;
```
Memori komputer dapat menampung banyak sekali data, akan tetapi ada tempat khusus di dalam memori yang tidak akan pernah diisi oleh data apapun yang disebut NULL 
Semua variable yang menunjukka pada lokasi tersebut atau bisa dikatakan variabel yang menyimpan alamat / lokasi dari NULL akan dianggap tidak memiliki nilai apapun.

>Apa gunanya Variabel Null?
>jika variabel tersebut memang tidak memiliki nilai untuk disimpan

|Data | Siswa	| TIPE DATA |
|-----|-------|-----------|
|Nama	| Ari |	String |
|Ekskul | 	Reparasi | String? | 	

contoh:
```dart
void main() {
  String nama = 'Dodo';
  String? ekskul = 'Reparasi';
  ekskul = null;
  print(nama);
  print(ekskul);
}
```

#Assignment
1. Buatlah nilai dari variabel nama dan kelas digabung menjadi satu, serta ketika ditampilkan nilai dari variabel kelas mengandung huruf kecil semua tanpa mengubah inisialisai nilai awal.
   OUTPUT : Roni Saputra, xii rpl
