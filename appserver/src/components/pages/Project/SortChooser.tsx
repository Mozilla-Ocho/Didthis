import {Select} from "@/components/uiLib"

const SortChooser = ({
  onChange,
  actualSort,
}: {
  onChange: (sort: 'asc' | 'desc') => void
  actualSort: 'asc' | 'desc'
}) => {
  const changeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const direction = e.target.value as 'asc' | 'desc'
    onChange(direction)
  }
  return (
    <div className="flex flex-row items-baseline gap-4 mb-7 text-sm">
      <label htmlFor="block sortby">Sort by:</label>
      <div className="grow sm:grow-0">
        <Select
          id="sortby"
          onChange={changeSort}
          value={actualSort}
          className="text-bodytext text-sm border-black-100"
        >
          <option key="desc" value="desc">
            Newest first
          </option>
          <option key="asc" value="asc">
            Oldest first
          </option>
        </Select>
      </div>
    </div>
  )
}

export default SortChooser
