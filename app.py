from flask import Flask, render_template, request, jsonify
import pandas as pd

app = Flask(__name__)

# Citirea fișierului Excel
df = pd.read_excel('Agentie_de_turism.xlsx', engine='openpyxl')

# Funcție pentru a căuta unități după nume
def cauta_unitate(nume):
    if not isinstance(nume, str) or not nume:
        return pd.DataFrame()  # Returnează un DataFrame gol dacă numele nu este valid
    rezultate = df[df['Nume unitate'].str.contains(nume, case=False, na=False)]
    return rezultate[['ID', 'Nume unitate', 'Tip unitate', 'Tip categorie']]

# Funcție pentru a obține toate informațiile unei unități de cazare după ID
def detalii_unitate(id):
    rezultat = df[df['ID'] == int(id)]
    return rezultat

@app.route('/', methods=['GET', 'POST'])
def index():
    rezultate = None
    detalii = None
    if request.method == 'POST':
        nume_cautat = request.form.get('nume_unitate')
        rezultate = cauta_unitate(nume_cautat)
        id_cautat = request.form.get('id')
        if id_cautat:
            detalii = detalii_unitate(id_cautat)
    return render_template('index.html', rezultate=rezultate, detalii=detalii)

@app.route('/autocomplete', methods=['GET'])
def autocomplete():
    search = request.args.get('q')
    if not isinstance(search, str) or not search:
        return jsonify([])  # Returnează o listă goală dacă căutarea nu este validă
    results = df[df['Nume unitate'].str.contains(search, case=False, na=False)]
    unitati = results[['Nume unitate']].drop_duplicates().head(10)
    suggestions = unitati['Nume unitate'].tolist()
    return jsonify(suggestions)

# Noua rută pentru afișarea detaliilor într-o pagină separată
@app.route('/detalii', methods=['GET'])
def detalii():
    id_cautat = request.args.get('id')
    if id_cautat:
        detalii = detalii_unitate(id_cautat)
        return render_template('detalii.html', detalii=detalii)
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
