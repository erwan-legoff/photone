<template>
  <v-container fluid class="pa-8 min-h-screen">
    <v-row justify="center">
      <v-col cols="12" md="10" lg="8">
        <v-card class="pa-6 pa-md-10 rounded-lg shadow-lg">
          <div class="text-center mb-12">
            <h1 class="text-h3 text-md-h2 font-weight-bold mb-4">
              Spricture
            </h1>
            <p class="text-h6 font-weight-regular">
              Une application photo sécurisée axée sur la confidentialité.
            </p>
          </div>

          <v-alert type="info" variant="tonal" border="start" density="compact" class="mb-8 rounded" icon="mdi-wrench">
            <span class="font-weight-medium">Note :</span> Ce projet est une démonstration technique
            personnelle visant à approfondir mes compétences en développement full-stack, notamment avec
            Spring Boot et Nuxt 3. Il est en développement actif.
          </v-alert>

          <section class="mb-10">
            <h2 class="text-h5 font-weight-semibold mb-4 border-b pb-2">
              <v-icon start icon="mdi-account-eye" />
              Présentation du Projet
            </h2>
            <p class="text-body-1 leading-relaxed">
              Spricture a pour objectif principal de vous permettre de stocker vos photos personnelles de
              manière sécurisée. L'innovation clé réside dans le <strong
                class="font-weight-medium text-secondary">chiffrement des photos directement sur votre
                appareil (côté client)</strong> avant même leur envoi vers le serveur. Cela garantit un
              niveau de confidentialité maximal, le serveur n'ayant jamais accès à vos photos en clair.
            </p>
            <p class="text-body-1 mt-3 leading-relaxed">
              À terme, vous pourrez organiser vos photos par albums, les partager au sein de groupes
              (Famille, Amis, Travail...), ajouter des tags pour faciliter la recherche, et
              potentiellement bénéficier d'une analyse locale par IA pour extraire automatiquement des
              métadonnées pertinentes, toujours dans le respect de votre vie privée.
            </p>
          </section>

          <section class="mb-10">
            <h2 class="text-h5 font-weight-semibold mb-4 border-b pb-2">
              <v-icon start icon="mdi-code-tags" />
              Technologies Utilisées
            </h2>
            <div class="d-flex flex-wrap ga-2">
              <v-chip color="primary" variant="flat" prepend-icon="mdi-language-java">Spring Boot</v-chip>
              <v-chip color="primary" variant="flat" prepend-icon="mdi-nuxt">Nuxt 3</v-chip>
              <v-chip color="primary" variant="flat" prepend-icon="mdi-vuetify">Vuetify</v-chip>
              <v-chip color="primary" variant="flat" prepend-icon="mdi-tailwind">Tailwind CSS</v-chip>
              <v-chip color="primary" variant="flat" prepend-icon="mdi-security">JWT
                (Authentification)</v-chip>
            </div>
          </section>

          <section class="mb-10">
            <h2 class="text-h5 font-weight-semibold mb-4 border-b pb-2">
              <v-icon start icon="mdi-cogs" />
              Fonctionnalités
            </h2>
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="text-h6 font-weight-medium mb-3">
                  <v-icon start icon="mdi-check-circle" color="success" />
                  Déjà implémentées (MVP)
                </h3>
                <v-list density="compact" class="bg-transparent">
                  <v-list-item prepend-icon="mdi-upload">Upload de photos</v-list-item>
                  <v-list-item prepend-icon="mdi-database-lock">Stockage sécurisé (base)</v-list-item>
                  <v-list-item prepend-icon="mdi-image-multiple">Affichage des photos</v-list-item>
                  <v-list-item prepend-icon="mdi-api">API Back-end pour les médias</v-list-item>
                  <v-list-item prepend-icon="mdi-account-plus">Inscription utilisateur</v-list-item>
                  <v-list-item prepend-icon="mdi-security">Authentification JWT</v-list-item>
                </v-list>
              </v-col>

              <v-col cols="12" md="6">
                <h3 class="text-h6 font-weight-medium mb-3">
                  <v-icon start icon="mdi-progress-wrench" color="warning" />
                  Fonctionnalités Prévues
                </h3>
                <v-list density="compact" class="bg-transparent">
                  <v-list-item prepend-icon="mdi-key-variant">Réinitialisation de mot de
                    passe</v-list-item>
                  <v-list-item prepend-icon="mdi-email-check">Validation d'inscription par
                    email</v-list-item>
                  <v-list-item prepend-icon="mdi-shield-lock">Chiffrement complet côté
                    client</v-list-item>
                  <v-list-item prepend-icon="mdi-folder-multiple-image">Gestion d'albums</v-list-item>
                  <v-list-item prepend-icon="mdi-account-group">Gestion de groupes
                    utilisateurs</v-list-item>
                  <v-list-item prepend-icon="mdi-share-variant">Partage de photos/albums</v-list-item>
                  <v-list-item prepend-icon="mdi-tag-multiple">Système de tags</v-list-item>
                  <v-list-item prepend-icon="mdi-sync">Synchronisation en arrière-plan</v-list-item>
                  <v-list-item prepend-icon="mdi-desktop-mac-dashboard">Application de bureau
                    (Objectif v2.0)</v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </section>

          <section class="text-center mt-12">
            <h2 class="text-h5 font-weight-semibold mb-6">
              Intéressé(e) ? Contactez-moi !
            </h2>
            <v-btn href="mailto:rw4nit0@gmail.com" color="secondary" size="large" rounded="lg" class="text-none"
              prepend-icon="mdi-email-fast">
              Envoyer un email
            </v-btn>
          </section>

        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
</script>

<style scoped>
.min-h-screen {
  min-height: 100vh;
}

.v-card {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3), 0 5px 10px rgba(0, 0, 0, 0.2);
}

.border-b {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.v-list-item {
  padding-left: 0 !important;
}

.v-list-item :deep(.v-list-item__prepend) .v-icon {
  margin-inline-end: 12px !important;
  opacity: 0.9;
}

.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(3, 218, 198, 0.5);
}

.text-secondary {
  color: rgb(var(--v-theme-secondary));
}
</style>