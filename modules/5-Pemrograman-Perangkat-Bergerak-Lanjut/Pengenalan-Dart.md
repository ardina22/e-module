# Bahasa Pemrograman Dart
## Variabel Dart
Di dalam bahasa Pemrograman Berorientasi Objek termasuk Dart, Variabel digunakan untuk menyimpan petunjuk/ alamat/ lokasi/ dari data di dalam memori dan tidak berfungsi menyimpan data 

Variabel adalah ruang dalam memori yang menyimpan nilai tipe data dan mempunyai nama. Dengan kata lain, variabel bertindak sebagai wadah untuk nilai-nilai dalam suatu program. Nama variabel disebut identifier. Berikut ini adalah aturan penamaan untuk variabel :
- Tidak boleh berupa kata kunci.
- Dapat berisi huruf dan angka.
- Tidak boleh berisi spasi dan karakter khusus, kecuali garis bawah (_) dan tanda dolar ($).
- Tidak boleh dimulai dengan angka.

### Penulisan Variabel 
#### Keyword Var
Sebuah variabel harus dideklarasikan sebelum digunakan. Di dalam dart untuk membuat variabel bisa menggunakan berbagai macam deklarasi. 
 Salah satu caranya, Dart menggunakan keyword var untuk mendeklarasikan variabel. Cara penulisan untuk mendeklarasikan variabel adalah seperti yang dicontohkan di bawah ini :

```dart
void main() {
    var usia = 17;
    print (nomor); 
}
```
Semua variabel di dart menyimpan referensi ke nilai, jadi bukan langsung menyimpan nilai variabel tersebut. Variabel bernama “usia” berisi referensi ke Object integer dengan nilai “12”.

#### Type Checking 
Dart mendukung type-checking (pemeriksaan tipe data) dengan mengawali nama variabel dengan tipe data. Pemeriksaan tipe data memastikan bahwa variabel tersebut hanya menyimpan data khusus untuk tipe data yang dipilih. Berikut contoh penulisan nama variabel yang didahului dengan tipe data.

```dart
void main() {
    String nama = 'Dodit';
    int usia = 17;
    print (nomor); 
}
```

Sehingga apabila nilai yang ditetapkan ke variabel tidak cocok dengan tipe data variabelnya maka akan menampilkan peringatan pesan error.

*note : Setiap variabel yang sudah dideklarasikan tetapi belum diinisialisasi di Dart maka akan memiliki nilai awal null. Hal ini dikarenakan Dart menganggap semua nilai sebagai Object.*

#### Keyword Dynamic 
Variabel yang dideklarasikan tanpa tipe data secara implisit akan dideklarasikan sebagai tipe data dynamic. Selain itu, variabel juga dapat dideklarasikan menggunakan kata kunci dynamic sebagai alternatif dari kata kunci var.
```dart
void main() {
    dynamic usia = 17;
    print (nomor); 
}
```
### Keyword Final dan Const
Keyword final dan const digunakan untuk mendeklarasikan nilai variabel yang tetap atau konstan di Dart. Jika sebuah variabel dideklarasikan menggunakan keyword final atau const, maka nilainya tidak dapat diubah setelah dideklarasikan. Kedua keyword ini bisa digunakan bersamaan dengan tipe data variabel atau sebagai pengganti kata kunci var.
- Keyword const :  merepresentasikan nilai konstan pada waktu kompilasi, sehingga nilai variabel const tidak dapat diubah setelah dideklarasikan.
```dart
void main() {
    final int usia = 17;
    print (usia); 
}
```

## Tipe Data Dart
-	int (integer)	: bilangan bulat
-	double 		: bilangan desimal
-	string		: kumpulan karakter dg ‘ ‘, “ “
-	bool (Boolean)	: memiliki 2 nilai false true
-	list
-	map
-	record
  
## Null & Nullabel Types
Memori komputer dapat menampung banyak sekali data, akan tetapi ada tempat khusus di dalam memori yang tidak akan pernah diisi oleh data apapun yang disebut NULL 
Semua variable yang menunjukka pada lokasi tersebut atau bisa dikatakan variabel yang menyimpan alamat / lokasi dari NULL akan dianggap tidak memiliki nilai apapun.
 Apa gunanya Variabel Null??
jika variabel tersebut memang tidak memiliki nilai untuk disimpan 
Data Siswa	TIPE DATA
Nama	Ari Wibowo	STRING
Usia	16	INT
Ekskul 	Reparasi 	

