export interface IRespuesta<T> {
    Codigo: Number
    Mensaje: string
    Datos?: [T]
}
