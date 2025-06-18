import React from 'react'
import { render } from '@testing-library/react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from '../../../components/ui/table'

jest.mock('../../../lib/utils', () => ({ cn: (...c: string[]) => c.filter(Boolean).join(' ') }))

describe('Table components', () => {
  it('renders table with caption and cells', () => {
    const { getByText } = render(
      <Table>
        <TableCaption>Cap</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>H</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>C</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>F</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    expect(getByText('Cap')).toBeInTheDocument()
    expect(getByText('H')).toBeInTheDocument()
    expect(getByText('C')).toBeInTheDocument()
    expect(getByText('F')).toBeInTheDocument()
  })
})
