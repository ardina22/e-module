# Praktik 1

1. Buka browser dan kunjungi website [flutter][link flutter]
2.  [link flutter]: https://flutter.dev/
3. Scroll ke bawah hingga menemukan bagian instalasi flutter kemudian klik install.
4. 

Kerjakan [Praktik 1][link prak]
[link prak]: https://bit.ly/modulPPB/

# Struktur Direktori Projek Flutter
- 📁 android berisi source code untuk aplikasi android;
- 📁 ios berisi source code untuk aplikasi iOS;
- 📁 lib berisi source code Dart, di sini kita akan menulis kode aplikasi;
- 📁 test berisi source code Dart untuk testing aplikasi;
- 📄 .gitignore adalah file Git;
- 📄 .metadata merupakan file yang berisi metadata project yang di-generate otomatis;
- 📄 .packages merupakan file yang berisi alamat path package yang dibuat oleh pub;
- 📄 flutter_app.iml merupakan file XML yang berisi keterangan project;
- 📄 pubspec.lock merupakan file yang berisi versi-versi library atau package. File ini dibuat oleh pub. Fungsinya untuk mengunci versi package.
- 📄 pubspec.yaml merupakan file yang berisi informasi tentang project dan library yang dibutuhkan;
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
