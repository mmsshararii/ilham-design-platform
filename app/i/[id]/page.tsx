export default function Page({ params }: { params: { id: string } }) {
  return <div>short link: {params.id}</div>
}
