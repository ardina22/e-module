# Variabel Dart
Di dalam bahasa Pemrograman Berorientasi Objek termasuk Dart, Variabel digunakan untuk menyimpan petunjuk/ alamat/ lokasi/ dari data di dalam memori dan tidak berfungsi menyimpan data 

Variabel adalah ruang dalam memori yang menyimpan nilai tipe data dan mempunyai nama. Dengan kata lain, variabel bertindak sebagai wadah untuk nilai-nilai dalam suatu program. Nama variabel disebut identifier. 

## Aturan Penamaan Variabel
Berikut ini adalah aturan penamaan untuk variabel :
- Menggunakan gaya penulisan camelCase 
- Tidak boleh berupa kata kunci.
- Dapat berisi huruf dan angka.
- Tidak boleh berisi spasi dan karakter khusus, kecuali garis bawah (_) dan tanda dolar ($).
- Tidak boleh dimulai dengan angka.

## Penulisan Variabel 
### Keyword Var
Sebuah variabel harus dideklarasikan sebelum digunakan. Di dalam dart untuk membuat variabel bisa menggunakan berbagai macam deklarasi. 
 Salah satu caranya, Dart menggunakan keyword var untuk mendeklarasikan variabel. Cara penulisan untuk mendeklarasikan variabel adalah seperti yang dicontohkan di bawah ini :
```dart
void main() {
    var usia = 17;
    print (usia); 
}
```
Semua variabel di dart menyimpan referensi ke nilai, jadi bukan langsung menyimpan nilai variabel tersebut. Variabel bernama “usia” berisi referensi ke Object integer dengan nilai “17”.

> LATIHAN :
> 
> Perhatikan contoh penggunaan keyword Var pada materi di atas. Gantilah nilai pada variabel usia yang sebelumnya 17 menjadi 18 tanpa menghapus varibael usia yang sudah dideklarasikan sebelumnya

#### Type Checking 
Dart mendukung type-checking (pemeriksaan tipe data) dengan mengawali nama variabel dengan tipe data. Pemeriksaan tipe data memastikan bahwa variabel tersebut hanya menyimpan data khusus untuk tipe data yang dipilih. Berikut contoh penulisan nama variabel yang didahului dengan tipe data.

```dart
void main() {
    String nama = 'Dodit';
    int usia = 17;
    print (nama); 
}
```

Sehingga apabila nilai yang ditetapkan ke variabel tidak cocok dengan tipe data variabelnya maka akan menampilkan peringatan pesan error.

*note : Setiap variabel yang sudah dideklarasikan tetapi belum diinisialisasi di Dart maka akan memiliki nilai awal null. Hal ini dikarenakan Dart menganggap semua nilai sebagai Object.*

#### Keyword Dynamic 
Variabel yang dideklarasikan tanpa tipe data secara implisit akan dideklarasikan sebagai tipe data dynamic yang bisa menampung semua jenis tipe data. Selain itu, variabel juga dapat dideklarasikan menggunakan kata kunci dynamic sebagai alternatif dari kata kunci var.
```dart
  dynamic dataAcak = "kelas 12 RPL";
  print(dataAcak);
  dataAcak = 12;
  print(dataAcak);
  dataAcak = true;
  print(dataAcak);
```

### Keyword Final
Final digunakan untuk mendeklarasikan nilai variabel yang tidak bisa dideklarsikan ulang tetapi nilai dari variabelnya bisa diubah.
Contoh penggunaan keyword Final:
```dart
void main() {
  final time = DateTime.now();
  print(time);
}
```

### Keyword Const
const digunakan untuk mendeklarasikan nilai variabel yang tidak bisa dideklarsikan ulang dan nilai dari variabelnya tidak bisa diubah.
Contoh penggunaan keyword Const:

```dart
void main() {
  const phi = 3.14;
  var luas = phi * 14 * 14;
  print("Luas Lingkaran:");
  print(luas);
}
```

### Keyword Late 
Late digunakan jika ingin membuat variabel yang dideklarasinya apabila nanti ketika variabel ingin diakses
Contoh penggunaan keyword Late:
```dart
String tampilkanData() {
  print("Roni Saputra");
  return "Kelas XII RPL";
}

void main() {
  late var hasil = tampilkanData();
  print("Data siswa SMK BP Subulul Huda");
  print(hasil);
}
```


