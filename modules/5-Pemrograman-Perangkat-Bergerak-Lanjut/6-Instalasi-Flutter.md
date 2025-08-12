# Praktik 1

1. Buka browser dan kunjungi website [flutter][link flutter]
2.  [link flutter]: https://flutter.dev/
3. Scroll ke bawah hingga menemukan bagian instalasi flutter kemudian klik install.
4. 

Kerjakan [Praktik 1][link prak]
[link prak]: https://bit.ly/modulPPB/

# Struktur Direktori Projek Flutter
- 📁 android berisi kode dan file konfigurasi untuk aplikasi Android, seperti AndroidManifest.xml dan MainActivity.java atau MainActivity.kt, yang merupakan titik masuk aplikasi Android​
- 📁 ios berisi file khusus untuk iOS, termasuk AppDelegate.swift yang digunakan untuk inisialisasi aplikasi iOS, serta file konfigurasi Info.plist
- 📁 lib berisi source code Dart, di sini kita akan menulis kode aplikasi,yang berisi logika aplikasi dan antarmuka pengguna (UI)​
- 📁 test berisi file untuk pengujian unit dan widget, memastikan aplikasi berjalan sesuai harapan. File pengujian ini biasanya memiliki akhiran _test.dart
- 📄 .gitignore adalah file Git;
- 📄 .metadata merupakan file yang berisi metadata project yang di-generate otomatis;
- 📄 .packages merupakan file yang berisi alamat path package yang dibuat oleh pub;
- 📄 flutter_app.iml merupakan file XML yang berisi keterangan project;
- 📄 pubspec.lock merupakan file yang berisi versi-versi library atau package. File ini dibuat oleh pub. Fungsinya untuk mengunci versi package.
- 📄 pubspec.yaml merupakan file yang berisi informasi tentang project dan library yang dibutuhkan, dan untuk mengelola dependensi dan konfigurasi proyek
- 📄 README.md merupakan file markdown yang berisi penjelasan tentang source code.

# Struktur Dasar Kode Aplikasi
```dart
import 'package:flutter/material.dart';

void main() {
  runApp(HomePage());
}

class HomePage extends StatelessWidget {
  build(context) {
    return MaterialApp(
        home: Scaffold(
          appBar: AppBar(
              backgroundColor: Colors.teal,
              leading: Icon(Icons.home),
              title: Text('Aplikasi Flutter Petani Kode')
          ),
        )
    );
  }
}
```
KETERANGAN
-  Import
   mengimpor library dan dependencies yang diperlukan untuk aplikasi, seperti material.dart untuk widget bawaan Flutter.
-  Fungsi Main
   titik masuk aplikasi, yang menjalankan widget pertama kali. Biasanya, ini memanggil runApp() untuk memulai aplikasi dengan widget tertentu.
-  Widget
  aplikasi Flutter dibangun dari widget, yang merupakan komponen utama untuk membangun antarmuka pengguna. Widget bisa berupa stateless atau stateful, tergantung pada apakah widget tersebut memiliki status yang berubah seiring waktu

