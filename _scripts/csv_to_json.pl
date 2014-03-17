#!/usr/bin/env perl

use strict;
use warnings;
use Mojo::JSON;
use Mojo::Util qw/ encode slurp spurt /;
use Text::CSV;
use utf8::all;
use autodie;
use Data::Dumper;
use Getopt::Long;

GetOptions(
    'input=s'  => \my $input_file,
    'output=s' => \my $output_file,
) or die( "Error in command line arguments\n" );
die( "--input and --output must be specified" )
    unless $input_file && $output_file;

my $csv = Text::CSV->new( { binary => 1, eol => $/ } );

open my $io, "<", $input_file;

my @data;
while ( my $row = $csv->getline( $io ) ) {
    push @data, $row;
}

my $headers = shift @data;

my $j = Mojo::JSON->new;
my $json = $j->encode( { aaData => [@data] } );

# Write the output to a filehandle
spurt $json, $output_file;
