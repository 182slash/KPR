PS X:\Project\Kelompok Penerbang Roket> tree /F
Folder PATH listing for volume 182
Volume serial number is 000002CB 30B6:2486
X:.
│   .gitignore
│   confidential.md
│   package.json
│   README.md
│   
├───.do
│       app.yaml
│       
├───.github
│   └───workflows
│           ci.yml
│           
├───backend
│   │   .env.example
│   │   Dockerfile
│   │   package.json
│   │   tsconfig.json
│   │   
│   ├───prisma
│   │       schema.prisma
│   │       
│   └───src
│       │   index.ts
│       │   
│       ├───config
│       │       cloudinary.ts
│       │       db.ts
│       │       env.ts
│       │       
│       ├───db
│       │   └───seeds
│       │           seed.ts
│       │           
│       ├───middleware
│       │       authGuard.ts
│       │       errorHandler.ts
│       │       
│       ├───routes
│       │       albums.ts
│       │       auth.ts
│       │       contact.ts
│       │       events.ts
│       │       media.ts
│       │       orders.ts
│       │       products.ts
│       │       upload.ts
│       │       
│       ├───services
│       │       emailService.ts
│       │       
│       └───{routes,controllers,middleware,services,config,db
│           └───{migrations,seeds}}
├───frontend
│   │   .env.example
│   │   next.config.js
│   │   package.json
│   │   postcss.config.js
│   │   tailwind.config.ts
│   │   tsconfig.json
│   │   vercel.json
│   │   
│   ├───public
│   │   └───{fonts,images,icons}
│   └───src
│       ├───app
│       │   │   globals.css
│       │   │   layout.tsx
│       │   │   page.tsx
│       │   │   
│       │   ├───about
│       │   │       AboutClient.tsx
│       │   │       page.tsx
│       │   │       
│       │   ├───contact
│       │   │       ContactClient.tsx
│       │   │       page.tsx
│       │   │       
│       │   ├───discography
│       │   │       DiscographyClient.tsx
│       │   │       page.tsx
│       │   │       
│       │   ├───events
│       │   │       EventsClient.tsx
│       │   │       page.tsx
│       │   │       
│       │   ├───media
│       │   │       MediaClient.tsx
│       │   │       page.tsx
│       │   │       
│       │   └───merch
│       │       │   MerchClient.tsx
│       │       │   page.tsx
│       │       │   
│       │       ├───cart
│       │       │       page.tsx
│       │       │       
│       │       ├───checkout
│       │       │       page.tsx
│       │       │       
│       │       └───[slug]
│       │               page.tsx
│       │               
│       ├───components
│       │   ├───features
│       │   │       CartDrawer.tsx
│       │   │       
│       │   ├───layout
│       │   │       Footer.tsx
│       │   │       Navbar.tsx
│       │   │       
│       │   └───ui
│       │           Button.tsx
│       │           index.tsx
│       │           
│       ├───lib
│       │       api.ts
│       │       motion.ts
│       │       utils.ts
│       │       
│       ├───store
│       │       cartStore.ts
│       │       
│       ├───types
│       │       index.ts
│       │       
│       └───{app
│           └───{about,discography,events,merch,cart,media,contact,admin
│               └───{events,merch,orders}},components
│                   └───{layout,ui,sections,features},lib,hooks,store,types}
├───scripts
│       setup.sh
│       
└───{frontend,backend,scripts,.github
    └───workflows}
PS X:\Project\Kelompok Penerbang Roket> 