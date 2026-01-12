import { CardFactory } from './cardFactory'

/**
 * Instance singleton du CardFactory.
 *
 * Les blueprints sont maintenant enregistrés via `registerCard()` dans chaque feature.
 * Voir les fichiers `register.ts` dans chaque dossier de feature.
 */
export const cardFactory = new CardFactory()
