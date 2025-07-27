# Tipe Data Dart
-	int (integer)	: bilangan bulat
  ```dart
   int usia = 17;
```
-	double 		: bilangan desimal
  ```dart
  > double tinggiBadan = 182.5;
```
-	num       : bisa menerima nilai int dan double
  ```dart
  num tinggiBadan = 182.5;
num usia = 17;
````
-	string		: kumpulan karakter dg ‘ ‘, “ “
  ```dart
String nama = "Roni Saputra, ";
String kelas = 'XII RPL';
```
|TUGAS | KETERANGAN |
|------|------------|
|1.| Bagaimana cara menggabungkan 2 string? |
|2.| implementasikan dalam coding sehingga contoh code penggunaan string di atas bisa menghasilkan output > Roni SAputra, XII RPL |


-	bool (Boolean)	: memiliki 2 nilai false true
-	list : identik dengan konsep array dalam bahasa pemrograman lain.Dengan memakai library dart : core memungkinkan pembuatan dan manipulasi tipe data ini melalui class List 
-	map : mewakili sekumpulan nilai sebagai pasangan key-value. Dengan memakai library dart : core memungkinkan pembuatan dan manipulasi tipe data ini melalui class List 

  
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
