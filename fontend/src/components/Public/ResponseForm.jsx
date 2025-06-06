import React, { useState } from "react";
import { apiService } from "../../services/api";
import Navbar from "../Layout/Navbar";

const ResponseForm = () => {
  const [formData, setFormData] = useState({
    visitDate: "",
    contact: {
      nom: "",
      email: "",
      telephone: "",
    },
    motif: "",
    satisfaction: "",
    service: "",
    commentaire: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const motifs = [
    "Information",
    "Prise de sang (Bilan)",
    "Retrait de résultat",
  ];

  const satisfactionOptions = ["Satisfait", "Mécontent"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("contact.")) {
      const contactField = name.replace("contact.", "");
      setFormData((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      await apiService.submitResponse(formData);
      setMessage(
        "Merci pour votre retour ! Votre réponse a été enregistrée avec succès."
      );

      // Reset form
      setFormData({
        visitDate: "",
        contact: { nom: "", email: "", telephone: "" },
        motif: "",
        satisfaction: "",
        service: "",
        commentaire: "",
      });
    } catch (error) {
      setMessage("Erreur lors de l'envoi. Veuillez réessayer.");
      console.error("Erreur:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Enquête de Satisfaction
            </h1>

            <p className="text-gray-600 text-center mb-8">
              Votre avis nous intéresse ! Merci de prendre quelques minutes pour
              évaluer votre visite.
            </p>

            {message && (
              <div
                className={`p-4 rounded-md mb-6 ${
                  message.includes("succès")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200"
                }`}
              >
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Date et heure de visite */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date et heure de la visite *
                </label>
                <input
                  type="datetime-local"
                  name="visitDate"
                  value={formData.visitDate}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Coordonnées de contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="contact.nom"
                    value={formData.contact.nom}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="contact.email"
                    value={formData.contact.email}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="contact.telephone"
                  value={formData.contact.telephone}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Raison de la présence */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Raison de votre présence *
                </label>
                <select
                  name="motif"
                  value={formData.motif}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sélectionnez une raison</option>
                  {motifs.map((motif) => (
                    <option key={motif} value={motif}>
                      {motif}
                    </option>
                  ))}
                </select>
              </div>

              {/* Niveau de satisfaction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Niveau de satisfaction *
                </label>
                <div className="flex space-x-4">
                  {satisfactionOptions.map((option) => (
                    <label key={option} className="flex items-center">
                      <input
                        type="radio"
                        name="satisfaction"
                        value={option}
                        checked={formData.satisfaction === option}
                        onChange={handleChange}
                        required
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span
                        className={`px-4 py-2 rounded-md ${
                          option === "Satisfait"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {option}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Service concerné */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service concerné *
                </label>
                <input
                  type="text"
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  required
                  placeholder="Ex: Accueil, Laboratoire, Consultation..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Commentaires */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recommandations ou commentaires libres
                </label>
                <textarea
                  name="commentaire"
                  value={formData.commentaire}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Vos suggestions d'amélioration, commentaires..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bouton de soumission */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 rounded-md text-white font-medium ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                }`}
              >
                {isSubmitting ? "Envoi en cours..." : "Envoyer ma réponse"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResponseForm;
