# Pengenalan R


# Instalasi R Studio
## Bahan
1. R
2. R Studio
## Langkah-Langkah
1. Download [Software R](https://cloud.r-project.org/bin/windows/base/R-4.5.1-win.exe)
2. Download [R Studio](https://download1.rstudio.org/electron/windows/RStudio-2025.05.1-513.exe)
3. Setelah melakukan download selanjutnya adalah install Software R dan R Studio
4. Kemudian buka R Studio
5. Buatlah projek baru dengan langkah berikut
   > File --> New Project --> New Direktori --> New Project --> Tuliskankan Nama Folder Anda --> Create
   
6. Buka lah Script R baru dengan menekan tombol `CRTL + SHIFT + N`
7. Coba mulai lah melakukan operasi aritmatika pada bagian consol
   > Contoh : 9 + 12 , 8 - 2, 7/2 , 8 * 5


## PRAKTIK
### 1. Melakukan deklarasi dan inisialisasi variabel
   - variabel : entitas yang digunakan untuk menyimpan nilai
   - deklarasi : tindakan memberi tahu kompiler bahwa Anda akan menggunakan variabel dengan nama dan tipe data tertentu
   - inisialisasi :memberikan nilai awal ke variabel yang telah Anda deklarasikan
```R
nama <- "Roni Saputra"
tinggiBadan <- 167
kelasSepuluh <- TRUE
```
### 2. Mengecek tipe data pada  masing-masing variabel pada PRAKTIK 1
   - Tipe Data : kategori data yang menentukan nilai apa saja yang dapat disimpan oleh sebuah variabel
```R
class(nama)
```
```R
class(tinggiBadan)
```
```R
class(kelasSepuluh)
```
Apa yang dihasilkan? Jelaskan pada laporan Anda

### 3. Buatlah vektor yang berisi nilai dari ujian Informatika 10 siswa,yaitu: 78, 85, 89, 78, 90, 70, 65, 88, 92, 74
Vektor pada R digunakan sebagai wadah untuk menampung nilai dengan tipe data yang sama
Berikut contoh mendeklarasikan vektor
```R
nilai.Informatika <- c(78, 85, 89, 78, 90, 70, 65, 88, 92, 74)
```
Berdasarkan vektor di atas tentukan :
1. Tentukan nilai tengah (median)
```R
median(nilai.Informatika)
```
2. Nilai rata-rata
```R
mean(nilai.Informatika)
```
3. Nilai Terendah
```R
min(nilai.Informatika)
```
4. Nilai Tertinggi
```R
max(nilai.Informatika)
```



Tombol pintasan di R:
- CTRL + L : untuk membersihkan consol
- CTRL + Enter : eksekusi program di dalam script
