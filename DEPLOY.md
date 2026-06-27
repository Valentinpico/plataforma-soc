# Despliegue — 1 instancia EC2 (AWS)

Todo el stack (frontend, API, PostgreSQL, Neo4j) corre en un solo EC2 con
`docker-compose.prod.yml`. Caddy sirve el frontend, hace de reverse-proxy a la
API y resuelve HTTPS automáticamente. URL pública estable vía Elastic IP +
`sslip.io` (sin registrar dominio).

## 1. Instancia

- Tipo: **t3.medium** (2 vCPU, 4 GB) — mínimo sano (Neo4j + Postgres + .NET).
- AMI: **Ubuntu 24.04 LTS**. Disco: 30 GB gp3.

## 2. Security group (firewall)

| Puerto | Origen | Para |
|--------|--------|------|
| 22 | tu IP | SSH |
| 80 | 0.0.0.0/0 | HTTP (challenge de Let's Encrypt + redirect) |
| 443 | 0.0.0.0/0 | HTTPS |

## 3. Elastic IP (la que no cambia)

1. EC2 → **Elastic IPs** → *Allocate* → *Associate* a la instancia.
2. Esa IP **sobrevive apagar/encender** la instancia.
3. La URL pública será: `https://<IP-con-guiones>.sslip.io`
   (IP `3.91.22.10` → host `3-91-22-10.sslip.io`).

## 4. Instalar Docker

```bash
sudo apt update && sudo apt install -y docker.io docker-compose-v2 git
sudo usermod -aG docker $USER && newgrp docker
sudo systemctl enable --now docker
```

## 5. Clonar y configurar

```bash
git clone https://github.com/Valentinpico/plataforma-soc.git
cd plataforma-soc
cp env.prod.example .env
nano .env   # poné contraseñas fuertes y SITE_ADDRESS=<IP-con-guiones>.sslip.io
```

## 6. Levantar

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Primer arranque: compila el frontend, publica la API, siembra los datos y Caddy
saca el certificado HTTPS (tarda ~1 min). Verificá:

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f caddy   # ver emisión del cert
```

Listo: **https://<IP-con-guiones>.sslip.io** → ponela en el informe (Anexo 2).

## 7. Apagar para ahorrar créditos / volver a encender

- **Apagar:** EC2 → *Stop instance*. Pagás solo EBS (~$2.4) + Elastic IP (~$3.6) ≈ $6/mes.
- **Encender:** *Start instance*. La Elastic IP **es la misma** → la URL no cambia.
- Los contenedores (`restart: unless-stopped`) y el frontend ya compilado vuelven
  solos al bootear; **no hace falta rebuild**. Si querés forzar: `docker compose -f docker-compose.prod.yml up -d`.

## 8. Actualizar tras cambios en el repo

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

## Notas

- **Modo lectura** por defecto; la edición exige `ADMIN_PASSWORD` (header, vía HTTPS).
- Memoria acotada por servicio (`mem_limit`) para no reventar los 4 GB.
- Para una URL propia: registrá un dominio, apuntá un A record a la Elastic IP y
  cambiá `SITE_ADDRESS` en `.env`. Nada más cambia.
