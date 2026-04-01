<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# SmartBooking API

### 1. Clonar proyecto.

### 2. Instalar dependencias:
```
npm install
```

### 3. Clonar el archivo ```.env.template``` y renombrarlo a ```.env```.

### 4. Cambiar las variables de entorno ```DB_PASSWORD``` y ```DB_NAME```.

### 5. Levantar la Base de Datos:
```
docker-compose up -d
```

### 6. Ejecutar en modo desarrollo:
```
npm run start:dev
```

### 7. Inicialización del sistema (Bootstrap)
Para completar la configuración inicial, debes ejecutar el proceso de bootstrap mediante el siguiente endpoint ```POST http://localhost:3000/setup```.

Este proceso realiza:
- Creación de la empresa inicial del sistema
- Registro del usuario administrador (SUPER_USER)
- Configuración base del entorno

⚠️ Este endpoint solo puede ejecutarse una vez. Si el sistema ya ha sido inicializado, no realizará cambios.

### Request Body:

```json
{
  "idType": "CC",
  "idNumber": "123456789",
  "fullName": "jhon doe",
  "userName": "jhondoe",
  "password": "MySecretPassword",
  "email": "jhondoe@email.com"
}
```

### Response:

```json
{
  "message": "Setup completed successfully",
  "success": true
}
```