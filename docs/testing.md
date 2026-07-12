# Dokumentasi Pengujian (Unit Testing)

## Project
Google Keep Clone 

## Ringkasan Eksekutif
Pengujian dilakukan untuk menjamin stabilitas sistem dengan pendekatan **Unit Testing** menggunakan **Jest**. Project ini mencapai standar tinggi dengan **100% Code Coverage** pada *Services* dan *Controllers*, memastikan seluruh alur bisnis teruji dengan skenario positif dan negatif.

## Metodologi
- **Framework**: Jest
- **Teknik**: Mocking (Dependency Injection)
- **Cakupan**: 45+ Test Cases (Mencakup CRUD, Error Handling, & Edge Cases)

---

## Hasil Pengujian (Summary)

 PASS  tests/noteService.test.js
 PASS  tests/noteRepositories.test.js
 PASS  tests/noteControllers.test.js
----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
----------------------|---------|----------|---------|---------|-------------------
All files             |     100 |    79.54 |     100 |     100 |                   
 controllers          |     100 |      100 |     100 |     100 |                   
  noteControllers.js  |     100 |      100 |     100 |     100 |                   
 repositories         |     100 |    65.38 |     100 |     100 |                   
  noteRepositories.js |     100 |    65.38 |     100 |     100 | 33-34,47,85-86    
 services             |     100 |      100 |     100 |     100 |                   
  noteService.js      |     100 |      100 |     100 |     100 |                   
----------------------|---------|----------|---------|---------|-------------------

Test Suites: 3 passed, 3 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        1.059 s
Ran all test suites.


## Daftar Skenario Pengujian

Pengujian dibagi menjadi 3 lapisan (Layer) sesuai dengan arsitektur aplikasi untuk memastikan setiap bagian tanggung jawab teruji dengan benar:
noteControllers.test.jsControllerValidasi input user, struktur response, dan integrasi dengan Service.
noteService.test.jsServiceLogika bisnis inti, pengolahan data, dan error handling (Skenario sukses & gagal).noteRepositories.test.jsRepositoryInteraksi database (Query) dengan melakukan mocking pada modul MySQL.

## Cara Menjalankan Testing

Untuk menjalankan pengujian secara lokal, gunakan perintah berikut:

1. **Install dependencies:**
   ```bash
   npm install

2. **Jalankan seluruh rangkaian pengujian:**
    npm test

3. **Jalankan pengujian dengan laporan coverage:**
    npx jest --coverage

4. **Untuk Menjalankan Aplikasi (Demo):**
    node server.js