export const Aux = (props) => {

    const { handleLogout, useruid } = props

    return (
        <div>
            <p>jlkndkn</p>
            <p>{useruid}</p>
            <button onClick={handleLogout}>Salor</button>
        </div>)
}