#include <stdio.h>
#include <assert.h>

/*
  start reading file at byte ... to get first packet length

  For each packet length, until EOF:
    - Read captured and total length
    - assert they are the same
    - increment packet count
    - Use length to determine where next packet's header begins
  - assert number of total packets is 99.
 */
int main(int argc, char *argv[])
{
  int packetCount = 0;
  int packetLength = 0;

  FILE *file = fopen("./prework/net.cap", "rb");

  unsigned char byte;

  int truncatedLength = 0;
  int untruncatedLength = 0;
  int fileHeaderLength = 24;
  int packetTimestampLength = 8;
  // read 24 octets (bytes) to pass the file header
  fseek(file, fileHeaderLength, SEEK_SET);

  while (1)
  {
    // in packet header
    // skip 8 bytes for timestap info
    // set truncatedLength to be the next 4 bytes
    // set untruncatedLength to be the next 4 bytes
    assert(fseek(file, packetTimestampLength, SEEK_CUR) == 0);
    fread(&truncatedLength, sizeof(int), 1, file);
    fread(&untruncatedLength, sizeof(int), 1, file);

    // assert the lengths are the same
    assert(truncatedLength == untruncatedLength);
    packetCount += 1;

    // skip the next truncatedLength bytes to get to the next packet header
    assert(fseek(file, truncatedLength, SEEK_CUR) == 0);
  }

  assert(packetCount == 99);
  fclose(file);

  return 0;
}