export default function Page({ params }: { params: { id: string } }) {

  const { id } = params

  return (
    <div style={{ padding: 40 }}>
      Dynamic test page
      <br />
      ID: {id}
    </div>
  )
}
