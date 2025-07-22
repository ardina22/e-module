# Variabel Dart
Di dalam bahasa Pemrograman Berorientasi Objek termasuk Dart, Variabel digunakan untuk menyimpan petunjuk/ alamat/ lokasi/ dari data di dalam memori dan tidak berfungsi menyimpan data 

Variabel adalah ruang dalam memori yang menyimpan nilai tipe data dan mempunyai nama. Dengan kata lain, variabel bertindak sebagai wadah untuk nilai-nilai dalam suatu program. Nama variabel disebut identifier. 

## Aturan Penamaan Variabel
Berikut ini adalah aturan penamaan untuk variabel :
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

#### Type Checking 
Dart mendukung type-checking (pemeriksaan tipe data) dengan mengawali nama variabel dengan tipe data. Pemeriksaan tipe data memastikan bahwa variabel tersebut hanya menyimpan data khusus untuk tipe data yang dipilih. Berikut contoh penulisan nama variabel yang didahului dengan tipe data.

```dart
void main() {
    String nama = 'Dodit';
    int usia = 17;
    print (nama); 
}
```
