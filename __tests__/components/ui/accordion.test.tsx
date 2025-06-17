import { fireEvent, render } from '@testing-library/react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/ui/accordion'

describe('Accordion', () => {
  it('toggles content visibility', () => {
    const { getByText, queryByText } = render(
      <Accordion type="single" collapsible>
        <AccordionItem value="item1">
          <AccordionTrigger>Trigger</AccordionTrigger>
          <AccordionContent>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    )

    expect(queryByText('Content')).not.toBeVisible()
    fireEvent.click(getByText('Trigger'))
    expect(queryByText('Content')).toBeVisible()
  })
})
