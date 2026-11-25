import Modal from "./Modal.jsx";

// Ventana para confirmar una acción que no se puede deshacer (eliminar, cancelar...)
export default function ModalConfirmar({ abierto, titulo, mensaje, textoConfirmar = "Confirmar", peligro = false, onConfirmar, onCerrar }) {
  return (
    <Modal abierto={abierto} onCerrar={onCerrar} titulo={titulo} ancho="estrecho">
      <p className="modal-texto">{mensaje}</p>
      <div className="modal-acciones">
        <button type="button" className="btn btn-ghost" onClick={onCerrar} data-autofocus>
          Volver
        </button>
        <button type="button" className={`btn ${peligro ? "btn-peligro" : "btn-primary"}`} onClick={onConfirmar}>
          {textoConfirmar}
        </button>
      </div>
    </Modal>
  );
}
