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
```dart
bool nilaiAngka = true;
  bool nilaiHuruf = false;
  print(nilaiAngka);
  print(nilaiHuruf);
```

### list 
List merupakan tipe data array yang berisi kumpulan data. Saat membuat list kita perlu menentukan isi dari tipe data listnya.
```data
  List<String> siswa = ['Roni', 'Putra', 'Sri'];
  List<int> kelas = [10, 11, 12];
  print(siswa);
  print(kelas);
```
- Menambahkan data ke dalam List
```dart
siswa.add("Puji");
```
- Mengambil data di dalam list
```dart
 print(siswa[1]);
```
- Mengubah data di dalam list
```dart
  siswa[0] = 'Satria';
```
- Menghapus data di dalam list
```dart
siswa.removeAt(3);
```
### map : 
Map adalah tipe data key-value.
Tipe data ini mirip dengan tipe data list, namun perbedaannya adalah jika list index dibuat secara otomatis, nilainya berupa int autoincrement yang dimulai dari nol, sedangkan map index harus dibuat sendiri dengan tipe data apapun.
```dart
  Map<String, int> siswa = {'Roni': 10, 'Putra': 11, 'Sri': 12};
  print(siswa);
  print(siswa['Putra']);
```
  
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

# Input Output 
Selain menggunakan fungsi print()  untuk menampilkan output ke dalam console, kita juga dapat menggunakan fungsi stdout.write().  Fungsi ini berada di dalam library dart:io. Jadi untuk menggunakan fungsi stdout.write(), kita harus mengimportnya terlebih dahulu. 
```dart
import 'dart:io';
void main() {
  stdout.write("Nama Anda:");
  var nama = stdin.readLineSync();
}
```
keteranga:
- Libray dart:io adalah libray yang berisi fungsi-fungsi, konstanta, class, dan objek untuk melakukan operasi input dan output
- Fungsi write() digunakan untuk menampilkan teks ke console
- readLineSync() adalah fungsi untuk membaca input dari keyboard. Fungsi ini akan mengembalikan nilai berupa String. 

```dart
stdout.write('Masukkan umur: ');
int umur = int.parse(stdin.readLineSync()!);
```
keterangan:
- `int parse` akan mengubah string '17' yang akan diinputkan oleh user menjadi angka 17 (tipe data int)

# Assignment
1. Buatlah nilai dari variabel nama dan kelas digabung menjadi satu, serta ketika ditampilkan nilai dari variabel kelas mengandung huruf kecil semua tanpa mengubah inisialisai nilai awal.
   OUTPUT : Roni Saputra, xii rpl

```dart
Masukkan nama: Ardi
Masukkan umur: 17
Masukkan tinggi badan: 168.5
Apakah kamu seorang pelajar? (true/false): true
Masukkan hobi kamu: Membaca

--- Data DIri Anda:  ---
Nama: Ardi
Umur: 17
Tinggi badan: 168.5
Status pelajar: true
Hobi: Membaca

```
