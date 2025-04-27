<template>
    <v-container>
        <h1 class="text-h4 mb-6">Visualisation des Couleurs de Thème Vuetify</h1>

        <p class="mb-6 text-medium-emphasis">
            Ces composants affichent les couleurs définies dans votre configuration de thème Vuetify.
            Le bouton ci-dessous permet de basculer entre le thème <code class="font-weight-bold">dark</code> (par
            défaut Vuetify)
            et votre thème personnalisé <code class="font-weight-bold">customDarkTheme</code>.
        </p>

        <v-card class="mb-6 pa-4" elevation="1">
            <v-card-title class="text-h6">Basculer le Thème</v-card-title>
            <v-card-text>
                Thème Actuel : <span class="font-weight-bold">{{ theme.global.name.value }}</span>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="toggleTheme" color="primary">
                    Passer au thème {{ theme.global.name.value === 'dark' ? 'customDarkTheme' : 'dark' }}
                </v-btn>
            </v-card-actions>
        </v-card>


        <v-row>
            <v-col cols="12">
                <v-card :color="theme.current.value.colors.surface" class="pa-6" elevation="2">
                    <h2 class="text-h6 mb-4">Couleurs de Fond</h2>
                    <p class="text-body-1 mb-4">
                        Ces couleurs définissent l'arrière-plan général de la page (<code
                            class="font-weight-bold">background</code>)
                        et le fond des composants comme les cartes ou les feuilles (<code
                            class="font-weight-bold">surface</code>).
                    </p>

                    <v-sheet :color="theme.current.value.colors.background" class="pa-4 elevation-1 mb-4 rounded">
                        <div :style="{ color: theme.current.value.colors['on-background'] }">
                            <p class="text-caption">Exemple de Background ({{ theme.current.value.colors.background }})
                            </p>
                            Ceci est du texte sur la couleur de background.
                            <v-sheet :color="theme.current.value.colors.surface" class="pa-4 mt-4 elevation-2 rounded">
                                <div :style="{ color: theme.current.value.colors['on-surface'] }">
                                    <p class="text-caption">Exemple de Surface ({{ theme.current.value.colors.surface
                                        }})</p>
                                    Ceci est du texte sur la couleur de surface.
                                </div>
                            </v-sheet>
                        </div>
                    </v-sheet>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card class="pa-6" elevation="2">
                    <h2 class="text-h6 mb-4">primary</h2>
                    <p class="text-body-1 mb-4">Couleur principale de l'application.</p>
                    <v-btn :color="theme.current.value.colors.primary" class="mb-2">Bouton Primary</v-btn>
                    <v-alert :color="theme.current.value.colors.primary" icon="mdi-star" density="compact">
                        <div :style="{ color: theme.current.value.colors['on-primary'] }">
                            Alerte Primary
                        </div>
                    </v-alert>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card class="pa-6" elevation="2">
                    <h2 class="text-h6 mb-4">secondary</h2>
                    <p class="text-body-1 mb-4">Couleur secondaire.</p>
                    <v-btn :color="theme.current.value.colors.secondary" class="mb-2">Bouton Secondary</v-btn>
                    <v-alert :color="theme.current.value.colors.secondary" icon="mdi-cog" density="compact">
                        <div :style="{ color: theme.current.value.colors['on-secondary'] }">
                            Alerte Secondary
                        </div>
                    </v-alert>
                </v-card>
            </v-col>

            <v-col cols="12" md="6">
                <v-card class="pa-6" elevation="2">
                    <h2 class="text-h6 mb-4">accent</h2>
                    <p class="text-body-1 mb-4">Couleur d'accentuation pour les éléments clés.</p>
                    <v-btn :color="theme.current.value.colors.accent" class="mb-2">Bouton Accent</v-btn>
                    <v-alert :color="theme.current.value.colors.accent" icon="mdi-flash" density="compact">
                        <div :style="{ color: theme.current.value.colors['on-accent'] }">
                            Alerte Accent
                        </div>
                    </v-alert>
                </v-card>
            </v-col>

            <v-col cols="12">
                <v-card class="pa-6" elevation="2">
                    <h2 class="text-h6 mb-4">Couleurs d'État (Error, Info, Success, Warning)</h2>
                    <p class="text-body-1 mb-4">Utilisées pour indiquer différents états (erreur, information, succès,
                        avertissement).</p>

                    <v-row>
                        <v-col cols="12" sm="6" md="3">
                            <v-alert type="error" title="Error" density="compact">
                                Quelque chose s'est mal passé.
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-alert type="info" title="Info" density="compact">
                                Voici une information.
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-alert type="success" title="Success" density="compact">
                                Opération réussie !
                            </v-alert>
                        </v-col>
                        <v-col cols="12" sm="6" md="3">
                            <v-alert type="warning" title="Warning" density="compact">
                                Attention à ce point.
                            </v-alert>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <v-col cols="12">
                <v-card class="pa-6" elevation="2">
                    <h2 class="text-h6 mb-4">Texte sur Couleurs de Thème</h2>
                    <p class="text-body-1 mb-4">Vuetify génère des couleurs de texte (<code
                            class="font-weight-bold">on-*</code>) pour assurer le contraste.</p>

                    <v-row>
                        <v-col cols="12" sm="6" md="4">
                            <v-sheet :color="theme.current.value.colors.primary" class="pa-3 rounded">
                                <div :style="{ color: theme.current.value.colors['on-primary'] }">
                                    Texte sur Primary
                                </div>
                            </v-sheet>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-sheet :color="theme.current.value.colors.secondary" class="pa-3 rounded">
                                <div :style="{ color: theme.current.value.colors['on-secondary'] }">
                                    Texte sur Secondary
                                </div>
                            </v-sheet>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-sheet :color="theme.current.value.colors.accent" class="pa-3 rounded">
                                <div :style="{ color: theme.current.value.colors['on-accent'] }">
                                    Texte sur Accent
                                </div>
                            </v-sheet>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-sheet :color="theme.current.value.colors.error" class="pa-3 rounded">
                                <div :style="{ color: theme.current.value.colors['on-error'] }">
                                    Texte sur Error
                                </div>
                            </v-sheet>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-sheet :color="theme.current.value.colors.info" class="pa-3 rounded">
                                <div :style="{ color: theme.current.value.colors['on-info'] }">
                                    Texte sur Info
                                </div>
                            </v-sheet>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-sheet :color="theme.current.value.colors.success" class="pa-3 rounded">
                                <div :style="{ color: theme.current.value.colors['on-success'] }">
                                    Texte sur Success
                                </div>
                            </v-sheet>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-sheet :color="theme.current.value.colors.warning" class="pa-3 rounded">
                                <div :style="{ color: theme.current.value.colors['on-warning'] }">
                                    Texte sur Warning
                                </div>
                            </v-sheet>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-sheet :color="theme.current.value.colors.surface" class="pa-3 rounded">
                                <div :style="{ color: theme.current.value.colors['on-surface'] }">
                                    Texte sur Surface
                                </div>
                            </v-sheet>
                        </v-col>
                        <v-col cols="12" sm="6" md="4">
                            <v-sheet :color="theme.current.value.colors.background" class="pa-3 rounded">
                                <div :style="{ color: theme.current.value.colors['on-background'] }">
                                    Texte sur Background
                                </div>
                            </v-sheet>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

        </v-row>
    </v-container>
</template>

<script setup>
import { useTheme } from 'vuetify'

// Accéder au thème global
const theme = useTheme()

// Fonction pour basculer entre les thèmes 'dark' et 'customDarkTheme'
function toggleTheme() {
    // Si le thème actuel est 'dark', passer à 'customDarkTheme'
    // Sinon, passer à 'dark'
    theme.global.name.value = theme.global.name.value === 'dark' ? 'customDarkTheme' : 'dark'
}
</script>

<style scoped>
/* Ajoutez des styles spécifiques à cette page si nécessaire */
</style>